import React, { useContext } from "react";
import { SurfaceControls } from "./SurfaceControls";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { JournalEntry } from "./JournalEntry";

export const SurfaceEditor: React.FC<Record<string, never>> = () => {
  const { entryEditorStates } = useContext(SurfaceEditorContext);

  const entryEditorComponents = Array.from(entryEditorStates.keys())
    .sort((a, b) => Date.parse(a) - Date.parse(b))
    .map((sortedEntryKey, i) => (
      <JournalEntry entryKey={sortedEntryKey} key={i}></JournalEntry>
    ));

  return (
    <>
      {/* <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        ref={domEditorRef}
      ></Editor> */}
      {entryEditorComponents}
      <SurfaceControls />
    </>
  );
};
