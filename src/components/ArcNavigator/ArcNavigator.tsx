import { Close } from "@mui/icons-material";
import { Button } from "@mui/material";
import { ArcDetail } from "components/ArcDetail/ArcDetail";
import { ArcSelectionContext } from "components/SelectionContext/ArcSelectionContext";
import { useOpenArc } from "components/SelectionContext/useOpenArc";
import React, { useContext } from "react";
import styles from "./ArcNavigator.less";

export const ArcNavigator: React.FC = () => {
  const { setOpenArcId } = useContext(ArcSelectionContext);
  const { isOpen, arc } = useOpenArc();

  if (!isOpen) return null;

  return (
    <div className={styles["arc-navigator"]}>
      <Button onClick={() => setOpenArcId(undefined)}>
        <Close></Close>
      </Button>
      <ArcDetail></ArcDetail>
    </div>
  );
};
