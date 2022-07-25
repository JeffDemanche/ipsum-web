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
        <button onClick={onClickSave}>S</button>
        &nbsp;
        <button onClick={onClickLoad}>L</button>
      </div>
    </div>
  );
};
