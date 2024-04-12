import { useQuery } from "@apollo/client";
import { Button, ClickAwayListener, TextField } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gql, updateJournalTitle } from "util/apollo";

import styles from "./JournalTitle.less";

const JournalTitleQuery = gql(`
  query JournalTitle {
    journalTitle
  }
`);

export const JournalTitle: React.FunctionComponent = () => {
  const {
    data: { journalTitle },
  } = useQuery(JournalTitleQuery);

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
      updateJournalTitle(inputVal.trim());
    }
    setEditing(false);
  }, [inputVal]);

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
            style: {
              fontSize: "20pt",
              height: "28px",
              textAlign: "center",
              fontFamily: "Inria Sans",
            },
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
          sx={{ fontSize: "20pt", fontFamily: "Inria Sans" }}
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
