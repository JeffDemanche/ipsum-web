import React from "react";
import styles from "./ArcDisambiguator.less";
import { ClickAwayListener } from "@mui/material";
import { ArcToken } from "components/Arc/ArcToken";
import { Popper } from "components/Popper/Popper";

interface ArcDisambiguatorProps {
  open: boolean;
  anchorEl: HTMLElement;
  arcIds: string[];
  onArcSelected: (arcId: string) => void;
  onClickAway?: (event: MouseEvent | TouchEvent) => void;
}

export const ArcDisambiguator: React.FunctionComponent<
  ArcDisambiguatorProps
> = ({ open, anchorEl, arcIds, onArcSelected, onClickAway }) => {
  return (
    <Popper
      id="arc-disambiguator"
      disablePortal
      open={open}
      anchorEl={anchorEl}
      popperOptions={{ strategy: "absolute" }}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <div className={styles["disambiguator"]}>
          {arcIds.map((arcId, i) => {
            return (
              <div key={i}>
                <ArcToken
                  arcId={arcId}
                  onClick={() => {
                    onArcSelected(arcId);
                  }}
                ></ArcToken>
              </div>
            );
          })}
        </div>
      </ClickAwayListener>
    </Popper>
  );
};
