import { Popper } from "../Popper/Popper";
import React from "react";
import TryIcon from "@mui/icons-material/Try";

interface SelectionRotorPopperProps {
  open: boolean;
  anchorEl: HTMLElement;
}

export const SelectionRotorPopper: React.FC<SelectionRotorPopperProps> = ({
  open,
  anchorEl,
}) => {
  return (
    <Popper
      id={"new-arc-popover"}
      open={open}
      anchorEl={anchorEl}
      disablePortal
      popperOptions={{ strategy: "absolute" }}
    >
      <TryIcon
        style={{ color: "white", fill: "none", stroke: "2px" }}
      ></TryIcon>
    </Popper>
  );
};
