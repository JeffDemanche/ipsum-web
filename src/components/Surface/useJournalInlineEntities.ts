import { EditorState, Modifier } from "draft-js";
import { useCallback, useContext } from "react";
import { SurfaceEditorContext } from "./SurfaceEditorContext";

interface UseJournalInlineEntitiesResult {
  addArcEntity: (arcId: string) => void;
}

/**
 * Returns functions that interface with DraftJS to apply inline entities to a
 * given editor.
 */
export const useJournalInlineEntities = ({
  editorId,
}: {
  editorId: string;
}): UseJournalInlineEntitiesResult => {
  const { entryEditorStates, setEntryEditorState } =
    useContext(SurfaceEditorContext);

  const editorState = entryEditorStates.get(editorId);

  const addArcEntity = useCallback(
    (arcId: string) => {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        "ARC",
        "IMMUTABLE",
        {
          ardId: arcId,
        }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const contentStateWithArc = Modifier.applyEntity(
        contentStateWithEntity,
        editorState.getSelection(),
        entityKey
      );
      setEntryEditorState(editorId, () =>
        EditorState.set(editorState, { currentContent: contentStateWithArc })
      );
    },
    [editorId, editorState, setEntryEditorState]
  );

  return { addArcEntity };
};
