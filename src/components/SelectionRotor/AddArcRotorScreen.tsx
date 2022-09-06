import styles from "./AddArcRotorScreen.less";
import { Add, HubOutlined, WorkspacesOutlined } from "@mui/icons-material";
import { TextField, Typography } from "@mui/material";
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
        <WorkspacesOutlined color="secondary" fontSize="small" />
        <TextField
          inputRef={inputRef}
          placeholder="New arc name..."
        ></TextField>
      </div>
      <div className={styles["row"]}>
        <HubOutlined color="secondary" fontSize="small" />
        <Typography color="secondary">Arc searcher component</Typography>
        <Button color="secondary" onClick={onAdd}>
          <Add></Add>
        </Button>
      </div>
    </div>
  );
};
