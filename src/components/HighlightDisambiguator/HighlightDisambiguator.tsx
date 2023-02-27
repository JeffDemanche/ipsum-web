import React, { useContext } from "react";
import styles from "./HighlightDisambiguator.less";
import { ClickAwayListener } from "@mui/material";
import { HighlightTag } from "components/HighlightTag";
import { Popper } from "components/Popper";
import { HighlightSelectionContext } from "components/SelectionContext";
import { noop } from "underscore";

interface HighlightDisambiguatorProps {
  open: boolean;
  anchorEl: HTMLElement;
  highlightIds: string[];
  onHighlightSelected: (highlight: string) => void;
  onClickAway?: (event: MouseEvent | TouchEvent) => void;
}

export const HighlightDisambiguator: React.FunctionComponent<
  HighlightDisambiguatorProps
> = ({ open, anchorEl, highlightIds, onHighlightSelected, onClickAway }) => {
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
          {highlightIds.map((highlightId, i) => {
            return (
              <div key={i}>
                <HighlightTag
                  highlightId={highlightId}
                  onClick={() => {
                    onHighlightSelected(highlightId);
                  }}
                  onMouseEnter={() => {
                    setHoveredHighlightId([highlightId]);
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
