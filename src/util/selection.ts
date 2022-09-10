import { Editor, SelectionState } from "draft-js";
import React from "react";

export class IpsumSelectionState {
  private readonly _draftSelectionState: SelectionState;
  private readonly _documentRange: Range;
  private readonly _editorRef: React.RefObject<Editor>;

  constructor(
    selectionState: SelectionState,
    range: Range,
    editorRef: React.RefObject<Editor>
  ) {
    this._draftSelectionState = selectionState;
    this._documentRange = range;
    this._editorRef = editorRef;
  }

  get selectionState() {
    return this._draftSelectionState;
  }

  get range() {
    return this._documentRange;
  }

  static rangeFromDocument() {
    return document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : null;
  }

  clone() {
    return new IpsumSelectionState(
      this._draftSelectionState,
      this.range?.cloneRange(),
      this._editorRef
    );
  }

  /**
   * Returns whether the entire selection is contained within the Editor DOM
   * node. This way we can ignore selections when some part of the selection
   * doesn't include editor text.
   */
  isContained() {
    if (!this.range) return false;
    const selectionCommonAncestor =
      this.range.commonAncestorContainer.parentNode;

    return !!this._editorRef?.current?.editor.contains(selectionCommonAncestor);
  }

  /**
   * Checks if the selection contains text.
   */
  isNonEmpty() {
    return (
      this._draftSelectionState &&
      this._documentRange?.START_TO_END &&
      this._draftSelectionState.getAnchorOffset() !==
        this._draftSelectionState.getFocusOffset()
    );
  }

  getRange(): Range {
    if (this.isContained() && this.isNonEmpty() && this.range) {
      return this.range;
    } else return null;
  }
}
