import {
  Button,
  ClickAwayListener,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useApiAction } from "state/api/use-api-action";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import styles from "./JournalTitle.less";

export const JournalTitle: React.FunctionComponent = () => {
  const { state } = useContext(InMemoryStateContext);
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
          defaultValue={state.journalTitle}
        ></TextField>
      );
    } else {
      return (
        <Button
          variant="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(true);
            }
          }}
          onClick={() => {
            setEditing(true);
          }}
        >
          {state.journalTitle}
        </Button>
      );
    }
  }, [editing, state.journalTitle, update]);

  return (
    <div className={styles["title-container"]}>
      <ClickAwayListener
        onClickAway={() => {
          update();
        }}
      >
        {content}
      </ClickAwayListener>
    </div>
  );
};
