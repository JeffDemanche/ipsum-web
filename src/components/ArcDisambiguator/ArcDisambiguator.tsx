import React, { useContext } from "react";
import styles from "./ArcDisambiguator.less";
import { ClickAwayListener } from "@mui/material";
import { ArcToken } from "components/Arc";
import { Popper } from "components/Popper";
import { ArcSelectionContext } from "components/SelectionContext";
import { noop } from "underscore";

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
  const { setHoveredArcIds } = useContext(ArcSelectionContext);

  return (
    <Popper
      id="arc-disambiguator"
      disablePortal
      open={open}
      anchorEl={anchorEl}
    >
      <ClickAwayListener onClickAway={onClickAway ?? noop}>
        <div className={styles["disambiguator"]}>
          {arcIds.map((arcId, i) => {
            return (
              <div key={i}>
                <ArcToken
                  arcForToken={{ type: "from id", id: arcId }}
                  onClick={() => {
                    onArcSelected(arcId);
                  }}
                  onMouseEnter={() => {
                    setHoveredArcIds([arcId]);
                  }}
                  onMouseLeave={() => {
                    setHoveredArcIds(undefined);
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
