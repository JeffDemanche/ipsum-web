import { ArcDetailContext, ArcDetailSection } from "components/ArcDetail";
import {
  EditorContext,
  EditorWrapper,
  useEntryEditor,
} from "components/EditorWrapper";
import { EditorState } from "draft-js";
import React, { useCallback, useContext, useMemo } from "react";
import { EntryType } from "util/apollo";
import { stringifyContentState } from "util/content-state";
import { useDebouncedCallback } from "util/hooks";

export const ArcDetailWikiSection: React.FunctionComponent = () => {
  const { arc } = useContext(ArcDetailContext);

  const arcId = arc.id;
  const arcName = arc.name;

  const { setEntryEditorState, onEditorFocus, onEditorBlur, saveEntry } =
    useContext(EditorContext);

  const entryKey = useMemo(() => `arc-entry-${arcId}`, [arcId]);

  const { editorRef, editorState } = useEntryEditor({
    entryKey,
    metadata: { entryType: EntryType.Arc, arcId, arcName },
  });

  /**
   * Debounced so we only update the state once every so often while typing.
   */
  const onEditorUpdate = useDebouncedCallback((newEditorState: EditorState) => {
    // Check to see if anything changed. This happens to fix a bug where editors
    // wouldn't clear after initializing a new journal due to the debounce
    // delay.
    const changed =
      stringifyContentState(editorState.getCurrentContent()) !==
      stringifyContentState(newEditorState.getCurrentContent());

    const contentState = newEditorState.getCurrentContent();

    if (newEditorState && changed) {
      const entry = {
        entryKey,
        stringifiedContentState: stringifyContentState(contentState),
      };
      console.log("Saving entry");
      saveEntry({ entryKey, editorState: newEditorState });
    }
  }, 500);

  const onChange = useCallback(
    (newEditorState: EditorState) => {
      setEntryEditorState(entryKey, () => {
        return newEditorState;
      });
      onEditorUpdate(newEditorState);
    },
    [entryKey, onEditorUpdate, setEntryEditorState]
  );

  const onFocus = useCallback(() => {
    onEditorFocus(entryKey);
  }, [entryKey, onEditorFocus]);

  const onBlur = useCallback(() => {
    onEditorBlur(entryKey);
  }, [entryKey, onEditorBlur]);

  return (
    <ArcDetailSection>
      {editorState && (
        <EditorWrapper
          enableControls
          enableHighlights
          placeholder="What is this arc about?"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          editorState={editorState}
          ref={editorRef}
        ></EditorWrapper>
      )}
    </ArcDetailSection>
  );
};
