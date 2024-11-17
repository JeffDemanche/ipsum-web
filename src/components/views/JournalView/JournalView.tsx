import { FormattingControlsProvider } from "components/molecules/FormattingControls";
import { BrowserDrawerConnected } from "components/organisms/BrowserDrawer";
import { JournalSettingsDrawerConnected } from "components/organisms/JournalSettingsDrawer";
import { JournalViewPagesSectionConnected } from "components/organisms/JournalViewPagesSection";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SerializationContext, SerializationProvider } from "util/serializer";
import {
  DeserializationResult,
  IpsumStateContext,
  IpsumStateProvider,
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
    if (deserializationResult.result === "parse_error") {
      deserializationResult.messages.forEach((error) => {
        console.error(error);
      });
    } else if (deserializationResult.result === "validator_error") {
      deserializationResult.validator.messages.forEach((error) => {
        console.error(error);
      });
    }
  }, [deserializationResult]);

  if (deserializationResult.result === "parse_error") {
    return (
      <>
        <h1>There was an error parsing the file</h1>
        <samp>
          {deserializationResult.messages.map((error, i) => (
            <span key={i}>
              {error}
              <br></br>
            </span>
          ))}
        </samp>
        <br></br>
        <button onClick={() => resetToInitial()}>Clear autosave state</button>
      </>
    );
  } else if (deserializationResult.result === "validator_error") {
    return (
      <>
        <h1>There was an error validating the file</h1>
        <samp>
          {deserializationResult.validator.messages.map((error, i) => (
            <span key={i}>
              {error}
              <br></br>
            </span>
          ))}
        </samp>
        <br></br>
        <button onClick={() => validatorFix()}>Run autofix script</button>
        <button onClick={() => resetToInitial()}>Clear autosave state</button>
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
