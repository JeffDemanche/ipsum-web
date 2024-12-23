import { FormattingControlsProvider } from "components/molecules/FormattingControls";
import { BrowserDrawerConnected } from "components/organisms/BrowserDrawer";
import { JournalSettingsDrawerConnected } from "components/organisms/JournalSettingsDrawer";
import { JournalViewPagesSectionConnected } from "components/organisms/JournalViewPagesSection";
import { ProjectLoadingStatusPage } from "components/organisms/ProjectLoadingStatusPage";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SerializationContext, SerializationProvider } from "util/serializer";
import type { DeserializationResult, ProjectState } from "util/state";
import {
  IpsumStateContext,
  IpsumStateProvider,
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

  const [deserializationResult, setDeserializationResult] =
    useState<DeserializationResult>();

  return (
    <SerializationProvider
      disableLoadFromAutosave={!!overrideProjectState}
      setProjectState={setProjectState}
      deserializationResult={deserializationResult}
      setDeserializationResult={setDeserializationResult}
    >
      <WithSerializationProvider
        deserializationResult={deserializationResult}
      />
    </SerializationProvider>
  );
};

const WithSerializationProvider = ({
  deserializationResult,
}: {
  deserializationResult: DeserializationResult;
}) => {
  const { resetToInitial, validatorFix } = useContext(SerializationContext);

  useEffect(() => {
    if (deserializationResult?.result === "parse_error") {
      deserializationResult.messages.forEach((error) => {
        console.error(error);
      });
    } else if (deserializationResult?.result === "validator_error") {
      deserializationResult.validator.messages.forEach((error) => {
        console.error(error);
      });
    }
  }, [deserializationResult]);

  if (
    deserializationResult?.result === "parse_error" ||
    deserializationResult?.result === "validator_error"
  ) {
    return (
      <ProjectLoadingStatusPage
        status={{
          type: "serialization_error",
          deserializationResult,
          validatorFix,
          resetToInitial,
        }}
      />
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
