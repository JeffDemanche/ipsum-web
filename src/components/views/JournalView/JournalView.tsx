import { FormattingControlsProvider } from "components/molecules/FormattingControls";
import { BrowserDrawerConnected } from "components/organisms/BrowserDrawer";
import { JournalSettingsDrawerConnected } from "components/organisms/JournalSettingsDrawer";
import { JournalViewPagesSectionConnected } from "components/organisms/JournalViewPagesSection";
import React, { useContext, useState } from "react";
import { SerializationProvider } from "util/serializer";
import {
  IpsumStateContext,
  IpsumStateProvider,
  ProjectState,
  useNormalizeUrl,
} from "util/state";

import styles from "./JournalView.less";

const WithIpsumStateProvider = ({
  overrideProjectState,
}: {
  overrideProjectState?: ProjectState;
}) => {
  const { setProjectState } = useContext(IpsumStateContext);

  const [projectStateErrors, setProjectStateErrors] = useState<string[]>([]);

  return (
    <SerializationProvider
      disabled={!!overrideProjectState}
      setProjectState={setProjectState}
      setProjectStateErrors={setProjectStateErrors}
    >
      <FormattingControlsProvider>
        <div className={styles["journal-view"]}>
          <JournalSettingsDrawerConnected />
          <div className={styles["pages-section-container"]}>
            <JournalViewPagesSectionConnected
              className={styles["pages-section"]}
            />
          </div>
          <BrowserDrawerConnected />
        </div>
      </FormattingControlsProvider>
    </SerializationProvider>
  );
};

interface JournalViewProps {
  overrideProjectState?: ProjectState;
}

export const JournalView: React.FunctionComponent<JournalViewProps> = ({
  overrideProjectState,
}) => {
  useNormalizeUrl("journal");

  return (
    <IpsumStateProvider projectState={overrideProjectState}>
      <WithIpsumStateProvider overrideProjectState={overrideProjectState} />
    </IpsumStateProvider>
  );
};
