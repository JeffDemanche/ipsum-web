import { EditorSelectionProvider } from "components/EditorSelection";
import React from "react";
import { DailyJournalEditorContextProvider } from "../components/DailyJournal";
import styles from "./ViewJournal.less";
import { VisibleEntriesProvider } from "../components/VisibleEntriesContext";
import { HighlightSelectionProvider } from "components/HighlightSelectionContext";
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
        <DailyJournalEditorContextProvider>
          <EditorSelectionProvider>
            <JournalHotkeysProvider>
              <HighlightSelectionProvider>
                {children}
              </HighlightSelectionProvider>
            </JournalHotkeysProvider>
          </EditorSelectionProvider>
        </DailyJournalEditorContextProvider>
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
