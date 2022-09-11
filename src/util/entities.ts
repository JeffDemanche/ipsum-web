/**
 * Deals with complex transformations for applying DraftJS entities for arcs,
 * adding abilities like multiple arcs for the same characters.
 */

import { ContentState, EditorState, Modifier, SelectionState } from "draft-js";

export class IpsumEntityTransformer {
  private _contentState: ContentState;

  constructor(contentState: ContentState) {
    this._contentState = contentState;
  }

  get contentState() {
    return this._contentState;
  }

  applyArc = (
    selectionState: SelectionState,
    arcId: string
  ): IpsumEntityTransformer => {
    const contentStateWithEntity = this.contentState.createEntity(
      "ARC",
      "MUTABLE",
      {
        arcId,
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const contentStateWithArc = Modifier.applyEntity(
      contentStateWithEntity,
      selectionState,
      entityKey
    );
    return new IpsumEntityTransformer(contentStateWithArc);
  };
}
