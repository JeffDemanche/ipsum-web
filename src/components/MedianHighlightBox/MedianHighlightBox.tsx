import { Card } from "@mui/material";
import { HighlightExcerpt } from "components/HighlightExcerpt";
import React from "react";
import styles from "./MedianHighlightBox.less";

interface MedianHighlightBoxProps {
  highlightId: string;
}

export const MedianHighlightBox: React.FunctionComponent<
  MedianHighlightBoxProps
> = ({ highlightId }) => {
  return (
    <Card>
      <HighlightExcerpt highlightId={highlightId} />
    </Card>
  );
};
