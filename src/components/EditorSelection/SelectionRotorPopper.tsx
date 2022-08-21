import { Popper } from "../Popper/Popper";
import React, { useCallback } from "react";
import styles from "./SelectionRotorPopper.less";
import { Button } from "components/Button/Button";
import { ClickAwayListener, Divider, Tooltip } from "@mui/material";
import { ManageSearch, PlaylistAdd } from "@mui/icons-material";

interface SelectionRotorPopperProps {
  open: boolean;
  anchorEl: HTMLElement;
  onClickAway?: (event: MouseEvent | TouchEvent) => void;
}

export const SelectionRotorPopper: React.FC<SelectionRotorPopperProps> = ({
  open,
  anchorEl,
  onClickAway,
}) => {
  const onPopperMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Popper
        id={"new-arc-popover"}
        open={open}
        anchorEl={anchorEl}
        popperOptions={{ strategy: "absolute" }}
        onMouseDown={onPopperMouseDown}
      >
        <div className={styles["rotor"]}>
          <Tooltip title="Add arc">
            <Button className={styles["rotorButton"]} color="secondary">
              <PlaylistAdd />
            </Button>
          </Tooltip>
          <Divider orientation="vertical" color="primary"></Divider>
          <Tooltip title="Assign arc">
            <Button className={styles["rotorButton"]} color="secondary">
              <ManageSearch />
            </Button>
          </Tooltip>
        </div>
      </Popper>
    </ClickAwayListener>
  );
};
