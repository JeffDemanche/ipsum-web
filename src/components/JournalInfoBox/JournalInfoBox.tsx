import { Button } from "components/Button/Button";
import React, { useCallback, useContext } from "react";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import styles from "./JournalInfoBox.less";

export const JournalInfoBox: React.FC = () => {
  const { state, saveToFile, loadFromFile } = useContext(InMemoryStateContext);

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
        <Button onClick={onClickSave}>S</Button>
        &nbsp;
        <Button onClick={onClickLoad}>L</Button>
      </div>
    </div>
  );
};
