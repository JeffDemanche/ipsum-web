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

  const lBracketSelState = SelectionState.createEmpty(startBracketBlock).merge({
    anchorOffset: startBracketIndex,
    focusOffset: startBracketIndex + 1,
  });
  const rBracketSelState = SelectionState.createEmpty(endBracketBlock).merge({
    anchorOffset: endBracketIndex,
    focusOffset: endBracketIndex + 1,
  });

  let contentWOBrackets = Modifier.removeRange(
    contentState,
    rBracketSelState,
    "forward"
  );
  contentWOBrackets = Modifier.removeRange(
    contentWOBrackets,
    lBracketSelState,
    "forward"
  );

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

describe("editor-state", () => {
  describe("createEditorStateFromFormat", () => {
    it("removes brackets across blocks", () => {
      const editorState1 = createEditorStateFromFormat(
        "<p>hello [world!</p><p>my] name is jeff</p>"
      );
      expect(editorState1.getCurrentContent().getPlainText()).toEqual(
        "hello world!\nmy name is jeff"
      );
      expect(editorState1.getSelection().getStartKey()).not.toEqual(
        editorState1.getSelection().getEndKey()
      );
      expect(editorState1.getSelection().getStartOffset()).toEqual(6);
      expect(editorState1.getSelection().getEndOffset()).toEqual(2);
    });

    it("has correct selections", () => {
      const editorState1 = createEditorStateFromFormat("[hello] world!");
      expect(editorState1.getCurrentContent().getPlainText("\u0001")).toBe(
        "hello world!"
      );
      expect(editorState1.getSelection().getStartOffset()).toBe(0);
      expect(editorState1.getSelection().getEndOffset()).toBe(5);

      const editorState2 = createEditorStateFromFormat("hello [world]!");
      expect(editorState2.getCurrentContent().getPlainText("\u0001")).toBe(
        "hello world!"
      );
      expect(editorState2.getSelection().getStartOffset()).toBe(6);
      expect(editorState2.getSelection().getEndOffset()).toBe(11);
    });

    it("creates selection across multiple blocks", () => {
      const editorState1 = createEditorStateFromFormat(
        "<p>hello [world!</p><p>my name] is jeff</p>"
      );
      expect(editorState1.getCurrentContent().getBlocksAsArray().length).toBe(
        2
      );
      expect(
        editorState1.getCurrentContent().getBlocksAsArray()[0].getText()
      ).toBe("hello world!");
    });

    it("handles non-matching brackets", () => {
      expect(() => createEditorStateFromFormat("[hello world!")).toThrowError(
        "createEditorStateFromFormat must have 1 or 0 matching pairs of brackets"
      );
      expect(() => createEditorStateFromFormat("hello world]!")).toThrowError(
        "createEditorStateFromFormat must have 1 or 0 matching pairs of brackets"
      );
      expect(() =>
        createEditorStateFromFormat("[[hello world]]!")
      ).toThrowError(
        "createEditorStateFromFormat must have 1 or 0 matching pairs of brackets"
      );
    });

    it("returns editor state whose selections refer to the correct block keys", () => {
      const editorState1 = createEditorStateFromFormat("[hello] world!");
      const blockKeyOnEditor = editorState1
        .getCurrentContent()
        .getBlocksAsArray()[0]
        .getKey();
      const selectionFocusBlockKey = editorState1.getSelection().getFocusKey();
      const selectionAnchorBlockKey = editorState1
        .getSelection()
        .getAnchorKey();
      expect(blockKeyOnEditor).toEqual(selectionFocusBlockKey);
      expect(blockKeyOnEditor).toEqual(selectionAnchorBlockKey);
    });
  });

  describe("moveEditorStateFromFormat", () => {
    it("correctly handles new selection", () => {
      const editorState1 = createEditorStateFromFormat("hello [world!]");
      const editorState2 = moveEditorSelectionFromFormat(
        editorState1,
        "[hello] world!"
      );
      const newSelection = editorState2.getSelection();
      expect(newSelection.getStartOffset()).toBe(0);
      expect(newSelection.getEndOffset()).toBe(5);
    });

    it("throws error if text changes", () => {
      const editorState1 = createEditorStateFromFormat("hello [world!]");
      expect(() =>
        moveEditorSelectionFromFormat(editorState1, "[goodbye] world!")
      ).toThrowError(
        "moveEditorSelectionFromFormat must have same content with different bracket positions"
      );
    });

    it("content block keys remain the same", () => {
      const editorState1 = createEditorStateFromFormat("hello [world!]");
      const editorState2 = moveEditorSelectionFromFormat(
        editorState1,
        "[hello] world!"
      );
      expect(
        editorState1.getCurrentContent().getBlocksAsArray()[0].getKey()
      ).toEqual(
        editorState2.getCurrentContent().getBlocksAsArray()[0].getKey()
      );
      expect(
        editorState2.getCurrentContent().getBlocksAsArray()[0].getKey()
      ).toEqual(editorState1.getSelection().getAnchorKey());
    });

    it("selection anchor and focus keys remain the same", () => {
      const initialEditor = createEditorStateFromFormat("hello [world!]");
      const newSelectionEditor = moveEditorSelectionFromFormat(
        initialEditor,
        "hell[o wor]ld!"
      );
      expect(initialEditor.getSelection().getAnchorKey()).toEqual(
        newSelectionEditor.getSelection().getAnchorKey()
      );
      expect(initialEditor.getSelection().getFocusKey()).toEqual(
        newSelectionEditor.getSelection().getFocusKey()
      );
    });
  });
});
