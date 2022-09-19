import {
  ContentBlock,
  ContentState,
  convertFromHTML,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";

/**
 * Creates a single-block editor state from a string.
 */
export const createEditorState = (
  content: string,
  anchorOffset: number,
  focusOffset: number
) => {
  const editorState = EditorState.createWithContent(
    ContentState.createFromText(content)
  );

  return moveEditorSelection({ editorState, anchorOffset, focusOffset });
};

/**
 * Creates a multi-block editor state from an array of content blocks, which can
 * be obtained from `convertFromHTML`.
 */
export const createEditorStateFromContentBlocks = (args: {
  contentBlocks: ContentBlock[];
  anchorKey: string;
  anchorOffset: number;
  focusKey: string;
  focusOffset: number;
}) => {
  const editorState = EditorState.createWithContent(
    ContentState.createFromBlockArray(args.contentBlocks)
  );

  return moveEditorSelection({
    editorState,
    anchorKey: args.anchorKey,
    anchorOffset: args.anchorOffset,
    focusKey: args.focusKey,
    focusOffset: args.focusOffset,
  });
};

/**
 * Creates an `EditorState` with content and a selection state based on a
 * provided string, which can include HTML for testing multiple blocks. The
 * string can optionally include single, matching "[" and "]" characters to
 * define the scope of the `SelectionState`.
 */
export const createEditorStateFromFormat = (content: string): EditorState => {
  const openBracketCount = content.split("[").length - 1;
  const closeBracketCount = content.split("]").length - 1;
  if (openBracketCount !== closeBracketCount || openBracketCount > 1) {
    throw new Error(
      "createEditorStateFromFormat must have 1 or 0 matching pairs of brackets"
    );
  }

  const blockArray = convertFromHTML(content);
  const contentState = ContentState.createFromBlockArray(
    blockArray.contentBlocks
  );

  const blocksText = contentState
    .getBlocksAsArray()
    .map((block) => ({ blockKey: block.getKey(), text: block.getText() }));

  let startBracketIndex: number;
  let startBracketBlock: string;
  let endBracketIndex: number;
  let endBracketBlock: string;

  blocksText.forEach((block) => {
    if (
      startBracketIndex === undefined &&
      !startBracketBlock &&
      block.text.includes("[")
    ) {
      startBracketBlock = block.blockKey;
      startBracketIndex = block.text.indexOf("[");
    }
    if (
      endBracketIndex === undefined &&
      !endBracketBlock &&
      block.text.includes("]")
    ) {
      endBracketBlock = block.blockKey;
      endBracketIndex = block.text.indexOf("]");
    }
  });

  let contentWOBrackets = contentState;

  if (startBracketIndex !== undefined && endBracketIndex !== undefined) {
    const lBracketSelState = SelectionState.createEmpty(
      startBracketBlock
    ).merge({
      anchorOffset: startBracketIndex,
      focusOffset: startBracketIndex + 1,
    });
    const rBracketSelState = SelectionState.createEmpty(endBracketBlock).merge({
      anchorOffset: endBracketIndex,
      focusOffset: endBracketIndex + 1,
    });

    contentWOBrackets = Modifier.removeRange(
      contentState,
      rBracketSelState,
      "forward"
    );
    contentWOBrackets = Modifier.removeRange(
      contentWOBrackets,
      lBracketSelState,
      "forward"
    );
  }

  const contentBlocksWOBrackets = contentWOBrackets.getBlocksAsArray();

  const acrossBlocks = startBracketBlock !== endBracketBlock;

  if (startBracketIndex === -1 || endBracketIndex === -1) {
    return EditorState.createWithContent(
      ContentState.createFromBlockArray(contentBlocksWOBrackets)
    );
  } else {
    return createEditorStateFromContentBlocks({
      contentBlocks: contentBlocksWOBrackets,
      anchorKey: startBracketBlock,
      anchorOffset: startBracketIndex,
      focusKey: endBracketBlock,
      focusOffset: acrossBlocks ? endBracketIndex : endBracketIndex - 1,
    });
  }
};

export const moveEditorSelection = (args: {
  editorState: EditorState;
  anchorKey?: string;
  anchorOffset: number;
  focusKey?: string;
  focusOffset: number;
}) => {
  const selection = args.editorState.getSelection();
  const updatedSelection = selection.merge({
    focusKey: args.focusKey ?? selection.getFocusKey(),
    focusOffset: args.focusOffset,
    anchorKey: args.anchorKey ?? selection.getAnchorKey(),
    anchorOffset: args.anchorOffset,
  });
  return EditorState.acceptSelection(args.editorState, updatedSelection);
};

/**
 * Takes an `EditorState` and a new formatted content string (with brackets for
 * selection). Throws an error if the content is not equal after parsing the
 * brackets and returns an `EditorState` with the updated selection.
 */
export const moveEditorSelectionFromFormat = (
  editorState: EditorState,
  content: string
) => {
  const newEditorState = createEditorStateFromFormat(content);

  const newSelection = newEditorState.getSelection();

  const oldBlockKeys = editorState
    .getCurrentContent()
    .getBlocksAsArray()
    .map((block) => block.getKey());
  const newBlockKeys = newEditorState
    .getCurrentContent()
    .getBlocksAsArray()
    .map((block) => block.getKey());

  const newSelectionOldAnchorKey =
    oldBlockKeys[newBlockKeys.indexOf(newSelection.getAnchorKey())];
  const newSelectionOldFocusKey =
    oldBlockKeys[newBlockKeys.indexOf(newSelection.getFocusKey())];

  if (
    editorState.getCurrentContent().getPlainText() !==
    newEditorState.getCurrentContent().getPlainText()
  ) {
    throw new Error(
      "moveEditorSelectionFromFormat must have same content with different bracket positions"
    );
  } else {
    return moveEditorSelection({
      editorState,
      anchorKey: newSelectionOldAnchorKey,
      anchorOffset: newSelection.getAnchorOffset(),
      focusKey: newSelectionOldFocusKey,
      focusOffset: newSelection.getFocusOffset(),
    });
  }
};
