import { ClickAwayListener, TextField } from "@mui/material";
import { Popper } from "components/Popper";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./ArcAssignmentPopper.less";
import { useSearchArcs } from "util/hooks";
import { nextHue } from "util/colors";
import { EditorSelectionContext } from "components/EditorSelection";
import { noop } from "underscore";
import { ArcTag } from "components/ArcTag";
import {
  assignHighlightToEntry,
  createArc,
  createHighlight,
  gql,
} from "util/apollo";
import { useQuery } from "@apollo/client";

interface ArcAssignmentPopoverProps {
  open: boolean;
  anchorEl: HTMLElement;
  editorKey: string;
  onClose?: () => void;
}

const ArcAssignmentPopperQuery = gql(`
  query ArcAssignmentPopper {
    journalMetadata {
      lastArcHue
    }
  }
`);

export const ArcAssignmentPopper: React.FunctionComponent<
  ArcAssignmentPopoverProps
> = ({ open, anchorEl, editorKey, onClose }) => {
  const { getSelection } = useContext(EditorSelectionContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    setInputVal("");
  }, [open]);

  const {
    data: { journalMetadata },
  } = useQuery(ArcAssignmentPopperQuery);

  const lastArcHue = journalMetadata?.lastArcHue;

  const arcs = useSearchArcs({ query: inputVal });

  const onInputKeyUp = () => {
    setInputVal(inputRef.current.value);
  };

  const addArc = useCallback(() => {
    const selection = getSelection(editorKey);
    const arc = createArc({
      name: inputVal,
    });
    const highlight = createHighlight({ arc: arc.id, entry: editorKey });
    assignHighlightToEntry({
      entryKey: editorKey,
      highlightId: highlight.id,
      selectionState: selection.selectionState,
    });
    onClose?.();
  }, [editorKey, getSelection, inputVal, onClose]);

  const assignArc = useCallback(
    (arcId: string) => {
      const selection = getSelection(editorKey);

      const highlight = createHighlight({ arc: arcId, entry: editorKey });
      assignHighlightToEntry({
        entryKey: editorKey,
        highlightId: highlight.id,
        selectionState: selection.selectionState,
      });
    },
    [editorKey, getSelection]
  );

  const tokens = [
    ...arcs.returnedArcs.map((arc, i) => (
      <div key={i} className={styles["token-wrapper"]}>
        <ArcTag
          arcForToken={{ type: "from id", id: arc.id }}
          onClick={() => {
            assignArc(arc.id);
          }}
        />
      </div>
    )),
  ];

  if (inputVal.trim().length > 0) {
    tokens.unshift(
      <div key={inputVal} className={styles["token-wrapper"]}>
        <ArcTag
          key={inputVal}
          arcForToken={{
            type: "from data",
            color: nextHue(lastArcHue),
            name: inputVal,
          }}
          onClick={addArc}
        ></ArcTag>
      </div>
    );
  }

  return (
    <Popper
      id="arc-assignment-popper"
      disablePortal
      open={open}
      anchorEl={anchorEl}
      popperOptions={{ strategy: "absolute" }}
    >
      <ClickAwayListener onClickAway={onClose ?? noop}>
        <div className={styles["arc-assignment"]}>
          <TextField
            variant="standard"
            autoCorrect="off"
            autoComplete="off"
            onKeyUp={onInputKeyUp}
            inputRef={inputRef}
            placeholder="Arc name..."
          ></TextField>
          <div className={styles["arcs-list"]}>{tokens}</div>
        </div>
      </ClickAwayListener>
    </Popper>
  );
};
