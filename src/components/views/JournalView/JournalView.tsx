import { BrowserDrawerConnected } from "components/organisms/BrowserDrawer";
import { JournalSettingsDrawerConnected } from "components/organisms/JournalSettingsDrawer";
import { JournalViewPagesSectionConnected } from "components/organisms/JournalViewPagesSection";
import React from "react";

import styles from "./JournalView.less";

export const JournalView: React.FunctionComponent = () => {
  return (
    <div className={styles["journal-view"]}>
      <JournalSettingsDrawerConnected />
      <div className={styles["pages-section-container"]}>
        <JournalViewPagesSectionConnected className={styles["pages-section"]} />
      </div>
      <BrowserDrawerConnected />
    </div>
  );
};
