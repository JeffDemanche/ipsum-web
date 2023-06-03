import { Button } from "components/Button";
import React, { useCallback, useContext } from "react";
import styles from "./JournalInfoBox.less";
import { JournalTitle } from "./JournalTitle";
import { ApolloSerializationContext } from "util/apollo";

export const JournalInfoBox: React.FC = () => {
  const { resetToInitial, saveToFile, loadFromFile } = useContext(
    ApolloSerializationContext
  );

  const onClickNew = useCallback(() => {
    resetToInitial();
  }, [resetToInitial]);

  const onClickSave = useCallback(() => {
    saveToFile();
  }, [saveToFile]);

  const onClickLoad = useCallback(() => {
    loadFromFile();
  }, [loadFromFile]);

  return (
    <div className={styles["journal-info-box"]}>
      <JournalTitle></JournalTitle>
      <div>
        <Button onClick={onClickNew} variant="contained" tooltip="New journal">
          New
        </Button>
        &nbsp;
        <Button
          onClick={onClickSave}
          variant="contained"
          tooltip="Save to file"
        >
          Save
        </Button>
        &nbsp;
        <Button
          onClick={onClickLoad}
          variant="contained"
          tooltip="Load from file"
        >
          Load
        </Button>
      </div>
    </div>
  );
};
