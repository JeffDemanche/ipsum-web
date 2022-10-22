import { Button } from "components/Button/Button";
import React, { useCallback, useContext } from "react";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import styles from "./JournalInfoBox.less";

export const JournalInfoBox: React.FC = () => {
  const { state, saveToFile, loadFromFile, resetToInitial } =
    useContext(InMemoryStateContext);

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
      <h1>{state.journalTitle}</h1>
      <div>
        <Button onClick={onClickNew} tooltip="New journal">
          N
        </Button>
        &nbsp;
        <Button onClick={onClickSave} tooltip="Save to file">
          S
        </Button>
        &nbsp;
        <Button onClick={onClickLoad} tooltip="Load from file">
          L
        </Button>
      </div>
    </div>
  );
};
