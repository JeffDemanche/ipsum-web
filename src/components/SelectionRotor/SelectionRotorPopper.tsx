import { Popper } from "../Popper/Popper";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./SelectionRotorPopper.less";
import { ClickAwayListener } from "@mui/material";
import { AddArcRotorScreen } from "./AddArcRotorScreen";
import { AssignArcRotorScreen } from "./AssignArcRotorScreen";
import { HomeRotorScreen } from "./HomeRotorScreen";

interface SelectionRotorPopperProps {
  editorKey: string;
  open: boolean;
  anchorEl: HTMLElement;
  onClickAway?: (event: MouseEvent | TouchEvent) => void;
}

export type RotorScreen = "Home" | "Add Arc" | "Assign Arc";

export const SelectionRotorPopper: React.FC<SelectionRotorPopperProps> = ({
  editorKey,
  open,
  anchorEl,
  onClickAway,
}) => {
  const [currentScreen, setCurrentScreen] = useState<RotorScreen>("Home");

  const screen = useMemo(() => {
    if (currentScreen === "Add Arc")
      return <AddArcRotorScreen editorKey={editorKey} />;
    else if (currentScreen === "Assign Arc") return <AssignArcRotorScreen />;
    else return <HomeRotorScreen setCurrentScreen={setCurrentScreen} />;
  }, [currentScreen, editorKey]);

  useEffect(() => {
    if (!open) setCurrentScreen("Home");
  }, [open]);

  return (
    <Popper
      id={"new-arc-popover"}
      // This allows proper tab focusing
      disablePortal
      open={open}
      anchorEl={anchorEl}
      popperOptions={{ strategy: "absolute" }}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <div>{screen}</div>
      </ClickAwayListener>
    </Popper>
  );
};
