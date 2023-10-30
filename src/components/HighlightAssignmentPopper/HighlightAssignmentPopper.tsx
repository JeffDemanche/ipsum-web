import { ClickAwayListener, Paper, Popper, Typography } from "@mui/material";
import React from "react";
import { noop } from "underscore";

interface HighlightAssignmentPopperProps {
  open: boolean;
  entryKey: string;
  onClose?: () => void;
  anchorEl?: HTMLElement;
}

export const HighlightAssignmentPopper: React.FunctionComponent<
  HighlightAssignmentPopperProps
> = ({ open, entryKey, onClose, anchorEl }) => {
  return (
    <Popper id="highlight-assignment-popper" anchorEl={anchorEl} open={open}>
      <ClickAwayListener onClickAway={onClose ?? noop}>
        <Paper>
          <Typography>HighlightAssignmentPopper</Typography>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
