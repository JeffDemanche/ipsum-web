import { Popover as MuiPopover } from "@mui/material";
import React from "react";

import styles from "./Popover.less";

type PopoverProps = {
  anchorEl?: HTMLElement;
  children: React.ReactNode;
} & Pick<React.ComponentProps<typeof MuiPopover>, "onClose" | "anchorOrigin">;

export const Popover: React.FunctionComponent<PopoverProps> = ({
  anchorEl,
  children,
  ...muiProps
}) => {
  return (
    <MuiPopover anchorEl={anchorEl} open={!!anchorEl} {...muiProps}>
      <div className={styles["popover-content"]}>{children}</div>
    </MuiPopover>
  );
};
