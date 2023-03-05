import React, { useContext, useMemo } from "react";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import styles from "./MedianSelectionSection.less";
import { MedianHighlightBox } from "components/MedianHighlightBox";

export const MedianSelectionSection: React.FunctionComponent = () => {
  const { selectedHighlightIds } = useContext(HighlightSelectionContext);

  const highlightBoxes = useMemo(() => {
    if (selectedHighlightIds.length !== 1) return null;
    else return <MedianHighlightBox highlightId={selectedHighlightIds[0]} />;
  }, [selectedHighlightIds]);

  return <div className={styles["selection-section"]}>{highlightBoxes}</div>;
};
