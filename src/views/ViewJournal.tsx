import { EditorSelectionProvider } from "components/EditorSelection";
import React from "react";
import { SurfaceEditorContextProvider } from "../components/Surface";
import styles from "./ViewJournal.less";
import { VisibleEntriesProvider } from "../components/VisibleEntriesContext";
import { ArcSelectionProvider } from "components/SelectionContext";
import { JournalHotkeysProvider } from "components/JournalHotkeys";
import { Diptych } from "components/Diptych";
import { DiptychProvider } from "components/DiptychContext";
import { JournalInfoBox } from "components/JournalInfoBox";
import { Calendar } from "components/Calendar";

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <DiptychProvider>
      <VisibleEntriesProvider>
        <SurfaceEditorContextProvider>
          <EditorSelectionProvider>
            <JournalHotkeysProvider>
              <ArcSelectionProvider>{children}</ArcSelectionProvider>
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
        <div className={styles["header-container"]}>
          <JournalInfoBox></JournalInfoBox>
          <Calendar></Calendar>
        </div>
        <Diptych></Diptych>
      </div>
    </ProvidersWrapper>
  );
};
