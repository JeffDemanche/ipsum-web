import React, { useContext } from "react";
import styles from "./ArcDisambiguator.less";
import { ClickAwayListener } from "@mui/material";
import { HighlightTag } from "components/HighlightTag";
import { Popper } from "components/Popper";
import { HighlightSelectionContext } from "components/SelectionContext";
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
  const { setHoveredHighlightIds: setHoveredHighlightId } = useContext(
    HighlightSelectionContext
  );

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
                <HighlightTag
                  highlightId=""
                  onClick={() => {
                    onArcSelected(arcId);
                  }}
                  onMouseEnter={() => {
                    setHoveredHighlightId([arcId]);
                  }}
                  onMouseLeave={() => {
                    setHoveredHighlightId(undefined);
                  }}
                ></HighlightTag>
              </div>
            );
          })}
        </div>
      </ClickAwayListener>
    </Popper>
  );
};
