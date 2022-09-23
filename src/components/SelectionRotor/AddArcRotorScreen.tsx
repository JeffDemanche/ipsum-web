import styles from "./AddArcRotorScreen.less";
import { Add } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { Button } from "components/Button/Button";
import React, { useCallback, useContext, useRef } from "react";
import { useApiAction } from "state/api/use-api-action";
import { EditorSelectionContext } from "components/EditorSelection/EditorSelectionContext";

interface AddArcRotorScreenProps {
  editorKey: string;
}

export const AddArcRotorScreen: React.FC<AddArcRotorScreenProps> = ({
  editorKey,
}: AddArcRotorScreenProps) => {
  const { getSelection } = useContext(EditorSelectionContext);

  const inputRef = useRef<HTMLInputElement>();

  const { act } = useApiAction<"createAndAssignArc">({
    name: "createAndAssignArc",
  });

  const onAdd = useCallback(() => {
    if (inputRef?.current) {
      const selection = getSelection(editorKey);
      act({
        entryKey: editorKey,
        name: inputRef.current.value,
        selectionState: selection.selectionState,
      });
    }
  }, [act, editorKey, getSelection]);

  return (
    <div className={styles["addArcRotorScreen"]}>
      <div className={styles["row"]}>
        <TextField
          autoFocus
          inputRef={inputRef}
          placeholder="New arc name..."
        ></TextField>
        <Button color="secondary" onClick={onAdd}>
          <Add></Add>
        </Button>
      </div>
    </div>
  );
};
