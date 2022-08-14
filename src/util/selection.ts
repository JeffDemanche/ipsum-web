import { Editor, SelectionState } from "draft-js";
import React from "react";

export class IpsumSelectionState {
  private readonly _selectionState: SelectionState;
  private readonly _documentSelection: Selection;
  private readonly _editorRef: React.RefObject<Editor>;

  constructor(
    selectionState: SelectionState,
    editorRef: React.RefObject<Editor>
  ) {
    this._selectionState = selectionState;
    this._documentSelection = document.getSelection();
    this._editorRef = editorRef;
  }

  get selectionState() {
    return this._selectionState;
  }

  get documentSelection() {
    return this._documentSelection;
  }

  /**
   * Returns whether the entire selection is contained within the Editor DOM
   * node. This way we can ignore selections when some part of the selection
   * doesn't include editor text.
   */
  isContained() {
    if (this._documentSelection.rangeCount === 0) return false;
    const selectionCommonAncestor =
      this._documentSelection.getRangeAt(0).commonAncestorContainer.parentNode;

    return !!this._editorRef.current?.editor.contains(selectionCommonAncestor);
  }

  /**
   * Checks if the selection contains text.
   */
  isNonEmpty() {
    return (
      this._selectionState &&
      this._selectionState.getAnchorOffset() !==
        this._selectionState.getFocusOffset()
    );
  }

  getRange(): Range {
    if (
      this.isContained() &&
      this.isNonEmpty() &&
      this._documentSelection.rangeCount > 0
    ) {
      return this._documentSelection.getRangeAt(0);
    } else return null;
  }
}
