import { ClickAwayListener } from "@mui/material";
import { Popper } from "components/Popper/Popper";
import { TextField } from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./ArcAssignmentPopper.less";
import { useSearchArcs } from "util/hooks/useSearchArcs";
import { ArcToken } from "components/Arc/ArcToken";
import { nextHue } from "util/colors";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { useApiAction } from "state/api/use-api-action";
import { EditorSelectionContext } from "components/EditorSelection/EditorSelectionContext";

interface ArcAssignmentPopoverProps {
  open: boolean;
  anchorEl: HTMLElement;
  editorKey: string;
  onClose?: () => void;
}

export const ArcAssignmentPopper: React.FunctionComponent<
  ArcAssignmentPopoverProps
> = ({ open, anchorEl, editorKey, onClose }) => {
  const { getSelection } = useContext(EditorSelectionContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputVal, setInputVal] = useState("");

  const { state } = useContext(InMemoryStateContext);
  const { act } = useApiAction({ name: "createAndAssignArc" });

  const lastArcHue = state.journalMetadata?.lastArcHue;

  const arcs = useSearchArcs(inputVal);

  const onInputKeyUp = () => {
    setInputVal(inputRef.current.value);
  };

  const addArc = useCallback(() => {
    const selection = getSelection(editorKey);
    act({
      name: inputVal,
      entryKey: editorKey,
      selectionState: selection.selectionState,
    });
    onClose?.();
  }, [act, editorKey, getSelection, inputVal, onClose]);

  const tokens = [
    ...arcs.returnedArcs.map((arc, i) => (
      <div key={i} className={styles["token-wrapper"]}>
        <ArcToken arcForToken={{ type: "from id", id: arc.id }} />
      </div>
    )),
  ];

  if (inputVal.trim().length > 0) {
    tokens.unshift(
      <div key={inputVal} className={styles["token-wrapper"]}>
        <ArcToken
          key={inputVal}
          arcForToken={{
            type: "from data",
            color: nextHue(lastArcHue),
            name: inputVal,
          }}
          onClick={addArc}
        ></ArcToken>
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
      <ClickAwayListener onClickAway={onClose}>
        <div className={styles["arc-assignment"]}>
          <TextField
            autoCorrect="off"
            autoComplete="off"
            onKeyUp={onInputKeyUp}
            inputRef={inputRef}
            placeholder="Arc name..."
            inputProps={{
              style: {
                paddingTop: "0px",
                paddingBottom: "0px",
                paddingLeft: "3px",
                paddingRight: "3px",
              },
            }}
          ></TextField>
          <div className={styles["arcs-list"]}>{tokens}</div>
        </div>
      </ClickAwayListener>
    </Popper>
  );
};
