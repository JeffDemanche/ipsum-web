import { Button } from "components/atoms/Button";
import { Type } from "components/atoms/Type";
import { font_family_monospace } from "components/styles";
import React from "react";
import type { DeserializationResult } from "util/state";

import styles from "./ProjectLoadingStatusPage.less";

interface ProjectLoadingStatusPageProps {
  status:
    | { type: "loading_autosave" }
    | {
        type: "serialization_error";
        deserializationResult: DeserializationResult;
        validatorFix?: () => void;
        resetToInitial?: () => void;
      };
}

export const ProjectLoadingStatusPage: React.FunctionComponent<
  ProjectLoadingStatusPageProps
> = ({ status }) => {
  const getMarkup = () => {
    switch (status.type) {
      case "loading_autosave":
        return <Type weight="light">Loading autosave...</Type>;
      case "serialization_error":
        if (status.deserializationResult.result === "parse_error") {
          return (
            <>
              <Type variant="heading">There was an error parsing the file</Type>
              <samp
                style={{ fontFamily: font_family_monospace, fontSize: "12pt" }}
              >
                {status.deserializationResult?.messages.map((error, i) => (
                  <span key={i}>
                    {error}
                    <br></br>
                  </span>
                ))}
              </samp>
              <br></br>
              <Button
                variant="outlined"
                onClick={() => status.resetToInitial?.()}
              >
                Clear autosave state
              </Button>
              <br />
              <br />
            </>
          );
        } else if (status.deserializationResult.result === "validator_error") {
          return (
            <>
              <Type variant="heading">
                There was an error validating the file
              </Type>
              <samp
                style={{ fontFamily: font_family_monospace, fontSize: "12pt" }}
              >
                {status.deserializationResult.validator.messages.map(
                  (error, i) => (
                    <span key={i}>
                      {error}
                      <br></br>
                    </span>
                  )
                )}
              </samp>
              <br></br>
              <Button
                variant="outlined"
                onClick={() => status.validatorFix?.()}
              >
                Run autofix script
              </Button>
              <Button
                variant="outlined"
                onClick={() => status.resetToInitial?.()}
              >
                Clear autosave state
              </Button>
              <br />
              <br />
            </>
          );
        }
        break;
      default:
        return null;
    }
  };

  return <div className={styles["status-page"]}>{getMarkup()}</div>;
};
