import { EditorSelectionProvider } from "components/EditorSelection";
import React from "react";
import { SurfaceEditorContextProvider } from "../components/Surface";
import styles from "./ViewJournal.less";
import { VisibleEntriesProvider } from "../components/VisibleEntriesContext";
import { HighlightSelectionProvider } from "components/SelectionContext";
import { JournalHotkeysProvider } from "components/JournalHotkeys";
import { Diptych } from "components/Diptych";
import { DiptychProvider } from "components/DiptychContext";
import { JournalInfoDrawer } from "components/JournalInfoDrawer";

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <DiptychProvider>
      <VisibleEntriesProvider>
        <SurfaceEditorContextProvider>
          <EditorSelectionProvider>
            <JournalHotkeysProvider>
              <HighlightSelectionProvider>
                {children}
              </HighlightSelectionProvider>
            </JournalHotkeysProvider>
          </EditorSelectionProvider>
        </SurfaceEditorContextProvider>
      </VisibleEntriesProvider>
    </DiptychProvider>
  );
};

export const ViewJournal: React.FC = () => {
  return (
    <ProvidersWrapper>
      <div className={styles["view-journal"]}>
        <JournalInfoDrawer></JournalInfoDrawer>
        <Diptych></Diptych>
      </div>
    </ProvidersWrapper>
  );
};
