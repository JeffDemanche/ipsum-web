import {
  createEditorStateFromFormat,
  moveEditorSelectionFromFormat,
} from "./editor-utils";

describe("editor-state", () => {
  describe("createEditorStateFromFormat", () => {
    it("can create without brackets", () => {
      const editorState = createEditorStateFromFormat("test");
      expect(editorState.getCurrentContent().getPlainText()).toBe("test");
    });

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
