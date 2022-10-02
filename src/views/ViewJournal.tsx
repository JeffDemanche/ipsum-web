import { Calendar } from "components/Calendar/Calendar";
import { JournalInfoBox } from "components/JournalInfoBox/JournalInfoBox";
import { EditorSelectionProvider } from "components/EditorSelection/EditorSelectionContext";
import React from "react";
import { Surface } from "../components/Surface/Surface";
import { SurfaceEditorContextProvider } from "../components/Surface/SurfaceEditorContext";
import styles from "./ViewJournal.less";
import { VisibleEntriesProvider } from "./VisibleEntriesContext";
import { ArcSelectionProvider } from "components/ArcSelection/ArcSelectionContext";
import { JournalHotkeysProvider } from "components/JournalHotkeys/JournalHotkeysContext";

export const ViewJournal: React.FC = () => {
  return (
    <VisibleEntriesProvider>
      <SurfaceEditorContextProvider>
        <EditorSelectionProvider>
          <JournalHotkeysProvider>
            <ArcSelectionProvider>
              <div className={styles["view-journal"]}>
                <div className={styles["fixed-width-interior"]}>
                  <div className={styles["column-container"]}>
                    <div className={styles["column-1"]}>
                      <div className={styles["column-1-floating"]}>
                        <JournalInfoBox></JournalInfoBox>
                        <Calendar></Calendar>
                      </div>
                    </div>
                    <div className={styles["column-2"]}>
                      <Surface></Surface>
                    </div>
                  </div>
                </div>
              </div>
            </ArcSelectionProvider>
          </JournalHotkeysProvider>
        </EditorSelectionProvider>
      </SurfaceEditorContextProvider>
    </VisibleEntriesProvider>
  );
};
