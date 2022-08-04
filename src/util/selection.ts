import { SelectionState } from "draft-js";

export class IpsumSelectionState {
  private _selectionState: SelectionState;

  constructor(selectionState: SelectionState) {
    this._selectionState = selectionState;
  }

  get selectionState() {
    return this._selectionState;
  }

  isSomethingSelected() {
    return (
      this._selectionState &&
      this._selectionState.getAnchorOffset() !==
        this._selectionState.getFocusOffset()
    );
  }
}
