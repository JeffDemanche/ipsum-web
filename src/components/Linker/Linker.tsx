import cx from "classnames";
import { Add } from "@mui/icons-material";
import { ClickAwayListener, IconButton, Paper, TextField } from "@mui/material";
import { ArcTag } from "components/ArcTag";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { useSearchArcs } from "util/hooks";
import styles from "./Linker.less";
import { nextHue } from "util/colors";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { theme } from "styles/styles";

interface LinkerProps {
  allowCreate?: boolean;
  onAddArc?: (name: string) => void;
  onChooseArc?: (id: string) => void;
  className?: string;
}

export const LinkerQuery = gql(`
  query Linker {
    journalMetadata {
      lastArcHue
    }
  }
`);

export const Linker: React.FunctionComponent<LinkerProps> = ({
  allowCreate = true,
  onAddArc,
  onChooseArc,
  className,
}) => {
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data } = useQuery(LinkerQuery);

  const inputRef = useRef<HTMLInputElement>(null);

  const onPlusClick = useCallback(() => {
    setSearching(true);
  }, []);

  const onClickAway = useCallback(() => {
    setSearching(false);
    setSearchTerm("");
  }, []);

  const { returnedArcs } = useSearchArcs({
    skip: searchTerm.trim().length === 0,
    query: searchTerm ?? "",
    maxResults: 10,
  });

  const arcComponents = returnedArcs.map((arc, i) => {
    return (
      <ArcTag
        key={i}
        className={styles["result-tag"]}
        arcForToken={{ type: "from id", id: arc.id }}
        onClick={() => {
          onChooseArc(arc.id);
        }}
      ></ArcTag>
    );
  });

  if (allowCreate && searchTerm.trim().length > 0) {
    arcComponents.unshift(
      <ArcTag
        key={-1}
        className={styles["result-tag"]}
        arcForToken={{
          type: "from data",
          color: nextHue(data.journalMetadata.lastArcHue),
          name: searchTerm,
        }}
        onClick={() => {
          onAddArc(searchTerm);
        }}
      ></ArcTag>
    );
  }

  return (
    <Paper
      sx={{ backgroundColor: (theme) => theme.palette.primary.dark }}
      className={cx(className, styles["linker"])}
    >
      <div className={styles["top-row"]}>
        {searching && (
          <ClickAwayListener onClickAway={onClickAway}>
            <TextField
              autoFocus
              autoComplete="off"
              sx={{ height: "24px", padding: "0" }}
              color="secondary"
              variant="outlined"
              InputProps={{
                sx: { color: "white", height: "24px", padding: "0" },
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Escape") {
                  onClickAway();
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(e.target.value);
              }}
              inputRef={inputRef}
              size="small"
            ></TextField>
          </ClickAwayListener>
        )}
        <IconButton
          aria-label="Add or link arc"
          onClick={onPlusClick}
          size="small"
        >
          <Add color="secondary"></Add>
        </IconButton>
      </div>
      <div>{arcComponents}</div>
    </Paper>
  );
};
