import { Diptych } from "components/Diptych";
import { DiptychProvider } from "components/DiptychContext";
import { HoveredHighlightsProvider } from "components/HoveredHighlightsContext";
import { JournalHotkeysProvider } from "components/JournalHotkeys";
import { JournalInfoDrawer } from "components/JournalInfoDrawer";
import React from "react";

import styles from "./ViewJournal.less";

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
