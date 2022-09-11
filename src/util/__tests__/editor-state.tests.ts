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

export const createEditorStateFromFormat = (content: string) => {
  const startBracket = content.indexOf("[");
  const endBracket = content.indexOf("]");

  const contentWOBrackets = content.replace("[", "").replace("]", "");

  if (startBracket === -1 || endBracket === -1) {
    return EditorState.createWithContent(
      ContentState.createFromText(contentWOBrackets)
    );
  } else {
    return createEditorState(contentWOBrackets, startBracket, endBracket - 1);
  }
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

describe("editor-state", () => {
  it("create editor state from format has correct selections", () => {
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

  it("create editor state from format handles non-matching brackets", () => {
    const editorState1 = createEditorStateFromFormat("[hello world!");
    expect(editorState1.getCurrentContent().getPlainText("\u0001")).toBe(
      "hello world!"
    );
    expect(editorState1.getSelection().getStartOffset()).toBe(0);
    expect(editorState1.getSelection().getEndOffset()).toBe(0);

    const editorState2 = createEditorStateFromFormat("hello world]!");
    expect(editorState2.getCurrentContent().getPlainText("\u0001")).toBe(
      "hello world!"
    );
    expect(editorState2.getSelection().getStartOffset()).toBe(0);
    expect(editorState2.getSelection().getEndOffset()).toBe(0);
  });
});
