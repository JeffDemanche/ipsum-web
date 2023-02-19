import { Button, ClickAwayListener, TextField } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useApiAction } from "state/api";
import styles from "./JournalTitle.less";
import { useStateFieldQuery } from "state/in-memory";

export const JournalTitle: React.FunctionComponent = () => {
  const { data: journalTitle } = useStateFieldQuery({ field: "journalTitle" });
  const { act } = useApiAction({ name: "updateJournalTitle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    if (editing) {
      inputRef.current.select();
    }
  }, [editing]);

  const onInputKeyUp = () => {
    setInputVal(inputRef.current.value);
  };

  const update = useCallback(() => {
    if (inputVal.trim() !== "") {
      act({ title: inputVal.trim() });
    }
    setEditing(false);
  }, [act, inputVal]);

  const content = useMemo(() => {
    if (editing) {
      return (
        <TextField
          autoFocus
          onFocus={() => {
            inputRef.current?.select();
          }}
          className={styles["title-text-field"]}
          inputProps={{
            style: { fontSize: "20pt", height: "28px", textAlign: "center" },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update();
            }
          }}
          onBlur={() => {
            setEditing(false);
          }}
          onKeyUp={onInputKeyUp}
          inputRef={inputRef}
          defaultValue={journalTitle}
        ></TextField>
      );
    } else {
      return (
        <Button
          variant="text"
          className={styles["title-button"]}
          sx={{ fontSize: "20pt" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(true);
            }
          }}
          onClick={() => {
            setEditing(true);
          }}
        >
          {journalTitle}
        </Button>
      );
    }
  }, [editing, journalTitle, update]);

  return (
    <div className={styles["title-container"]}>
      <ClickAwayListener
        onClickAway={() => {
          if (editing) update();
        }}
      >
        {content}
      </ClickAwayListener>
    </div>
  );
};
