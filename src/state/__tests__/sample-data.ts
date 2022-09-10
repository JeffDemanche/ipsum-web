import { ContentState, EditorState } from "draft-js";

/**
 * Testing util that creates a sample DraftJS EditorState for use in testing.
 *
 * For "Hello [world]!" try createEditorState("Hello world!", 6, 5)
 */
export const createEditorState = (
  content: string,
  anchorOffset: number,
  focusOffset: number
) => {
  const editorState = EditorState.createWithContent(
    ContentState.createFromText(content)
  );

  return moveEditorSelection(editorState, anchorOffset, focusOffset);
};

export const moveEditorSelection = (
  editorState: EditorState,
  anchorOffset: number,
  focusOffset: number
) => {
  const selection = editorState.getSelection();
  const updatedSelection = selection.merge({
    focusKey: selection.getFocusKey(),
    focusOffset,
    anchorOffset,
  });
  return EditorState.acceptSelection(editorState, updatedSelection);
};
