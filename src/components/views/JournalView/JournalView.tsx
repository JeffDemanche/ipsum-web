import { FormattingControlsProvider } from "components/molecules/FormattingControls";
import { BrowserDrawerConnected } from "components/organisms/BrowserDrawer";
import { JournalSettingsDrawerConnected } from "components/organisms/JournalSettingsDrawer";
import { JournalViewPagesSectionConnected } from "components/organisms/JournalViewPagesSection";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SerializationContext, SerializationProvider } from "util/serializer";
import {
  IpsumStateContext,
  IpsumStateProvider,
  PROJECT_STATE,
  ProjectState,
  useNormalizeUrl,
} from "util/state";

import styles from "./JournalView.less";

interface JournalViewProps {
  overrideProjectState?: ProjectState;
}

export const JournalView: React.FunctionComponent<JournalViewProps> = ({
  overrideProjectState,
}) => {
  const [params] = useSearchParams();

  const siddhartha = params.has("siddhartha");

  if (siddhartha) {
    overrideProjectState = mockSiddhartha().projectState;
  }

  useNormalizeUrl("journal");

  return (
    <IpsumStateProvider projectState={overrideProjectState}>
      <WithIpsumStateProvider overrideProjectState={overrideProjectState} />
    </IpsumStateProvider>
  );
};

const WithIpsumStateProvider = ({
  overrideProjectState,
}: {
  overrideProjectState?: ProjectState;
}) => {
  const { setProjectState } = useContext(IpsumStateContext);

  const [projectStateErrors, setProjectStateErrors] = useState<string[]>([]);

  return (
    <SerializationProvider
      disableLoadFromAutosave={!!overrideProjectState}
      setProjectState={setProjectState}
      setProjectStateErrors={setProjectStateErrors}
    >
      <WithSerializationProvider projectStateErrors={projectStateErrors} />
    </SerializationProvider>
  );
};

const WithSerializationProvider = ({
  projectStateErrors,
}: {
  projectStateErrors: string[];
}) => {
  const { resetToInitial } = useContext(SerializationContext);

  useEffect(() => {
    if (projectStateErrors.length > 0) {
      projectStateErrors.forEach((error) => {
        console.error(error);
      });
    }
  }, [projectStateErrors]);

  if (projectStateErrors.length > 0) {
    return (
      <>
        <h1>There was an error deserializing the file</h1>
        <samp>
          {projectStateErrors.map((error) => (
            <>
              {error}
              <br></br>
            </>
          ))}
        </samp>
        <br></br>
        <button onClick={() => resetToInitial()}>Reset autosave state</button>
      </>
    );
  }

  return (
    <FormattingControlsProvider>
      <div className={styles["journal-view"]}>
        <div className={styles["settings-drawer-container"]}>
          <JournalSettingsDrawerConnected className={styles["settings"]} />
        </div>
        <div className={styles["pages-section-container"]}>
          <JournalViewPagesSectionConnected
            className={styles["pages-section"]}
          />
        </div>
        <div className={styles["browser-drawer-container"]}>
          <BrowserDrawerConnected className={styles["browser-drawer"]} />
        </div>
      </div>
    </FormattingControlsProvider>
  );
};
