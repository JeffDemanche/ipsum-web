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
import { useApiAction } from "state/api/SCH_use-api-action";
import { EditorSelectionContext } from "components/EditorSelection/EditorSelectionContext";
import { noop } from "underscore";
import { useStateFieldQuery } from "state/in-memory";

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

  useEffect(() => {
    setInputVal("");
  }, [open]);

  const { data: journalMetadata } = useStateFieldQuery({
    field: "journalMetadata",
  });

  const { act: addArcAction } = useApiAction({
    name: "createAndAssignArc",
  });
  const { act: assignArcAction } = useApiAction({ name: "assignArc" });

  const lastArcHue = journalMetadata?.lastArcHue;

  const arcs = useSearchArcs({ query: inputVal });

  const onInputKeyUp = () => {
    setInputVal(inputRef.current.value);
  };

  const addArc = useCallback(() => {
    const selection = getSelection(editorKey);
    addArcAction({
      name: inputVal,
      entryKey: editorKey,
      selectionState: selection.selectionState,
    });
    onClose?.();
  }, [addArcAction, editorKey, getSelection, inputVal, onClose]);

  const assignArc = useCallback(
    (arcId: string) => {
      const selection = getSelection(editorKey);
      assignArcAction({
        arcId,
        entryKey: editorKey,
        selectionState: selection.selectionState,
      });
    },
    [assignArcAction, editorKey, getSelection]
  );

  const tokens = [
    ...arcs.returnedArcs.map((arc, i) => (
      <div key={i} className={styles["token-wrapper"]}>
        <ArcToken
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
