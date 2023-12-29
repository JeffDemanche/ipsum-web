import React from "react";
import styles from "./ViewJournal.less";
import { HoveredHighlightsProvider } from "components/HoveredHighlightsContext";
import { JournalHotkeysProvider } from "components/JournalHotkeys";
import { Diptych } from "components/Diptych";
import { DiptychProvider } from "components/DiptychContext";
import { JournalInfoDrawer } from "components/JournalInfoDrawer";

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <DiptychProvider>
      <JournalHotkeysProvider>
        <HoveredHighlightsProvider>{children}</HoveredHighlightsProvider>
      </JournalHotkeysProvider>
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
