import { BrowserDrawerConnected } from "components/organisms/BrowserDrawer";
import { JournalSettingsDrawerConnected } from "components/organisms/JournalSettingsDrawer";
import { JournalViewPagesSectionConnected } from "components/organisms/JournalViewPagesSection";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { IpsumStateProvider, useNormalizeUrl } from "util/state";

import styles from "./JournalView.less";

export const JournalView: React.FunctionComponent = () => {
  useNormalizeUrl("journal");

  return (
    <IpsumStateProvider projectState={mockSiddhartha().projectState}>
      <div className={styles["journal-view"]}>
        <JournalSettingsDrawerConnected />
        <div className={styles["pages-section-container"]}>
          <JournalViewPagesSectionConnected
            className={styles["pages-section"]}
          />
        </div>
        <BrowserDrawerConnected />
      </div>
    </IpsumStateProvider>
  );
};
