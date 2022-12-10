import { EditorSelectionProvider } from "components/EditorSelection/EditorSelectionContext";
import React from "react";
import { SurfaceEditorContextProvider } from "../components/Surface/SurfaceEditorContext";
import styles from "./ViewJournal.less";
import { VisibleEntriesProvider } from "../components/VisibleEntriesContext/VisibleEntriesContext";
import { ArcSelectionProvider } from "components/SelectionContext/ArcSelectionContext";
import { JournalHotkeysProvider } from "components/JournalHotkeys/JournalHotkeysContext";
import { ArcNavigator } from "components/ArcNavigator/ArcNavigator";
import { DailyJournal } from "components/DailyJournal/DailyJournal";

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <VisibleEntriesProvider>
      <SurfaceEditorContextProvider>
        <EditorSelectionProvider>
          <JournalHotkeysProvider>
            <ArcSelectionProvider>{children}</ArcSelectionProvider>
          </JournalHotkeysProvider>
        </EditorSelectionProvider>
      </SurfaceEditorContextProvider>
    </VisibleEntriesProvider>
  );
};

export const ViewJournal: React.FC = () => {
  return (
    <ProvidersWrapper>
      <div className={styles["view-journal"]}>
        <DailyJournal></DailyJournal>
        <ArcNavigator></ArcNavigator>
      </div>
    </ProvidersWrapper>
  );
};
