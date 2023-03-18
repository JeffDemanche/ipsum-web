import { Comment } from "@mui/icons-material";
import { Card, IconButton } from "@mui/material";
import { ArcTag } from "components/ArcTag";
import { DiptychContext } from "components/DiptychContext";
import { HighlightExcerpt } from "components/HighlightExcerpt";
import React, { useCallback, useContext } from "react";
import { useStateDocumentQuery } from "state/in-memory";
import { IpsumArcColor } from "util/colors";
import styles from "./MedianHighlightBox.less";

interface MedianHighlightBoxProps {
  highlightId: string;
}

export const MedianHighlightBox: React.FunctionComponent<
  MedianHighlightBoxProps
> = ({ highlightId }) => {
  const { openArcDetail } = useContext(DiptychContext);

  const { data: highlightData } = useStateDocumentQuery({
    collection: "highlight",
    keys: [highlightId],
  });

  const arcId = highlightData[highlightId]?.arcId;

  const { data: arcData } = useStateDocumentQuery({
    collection: "arc",
    keys: [arcId],
  });

  const cardColor = arcData[arcId]
    ? new IpsumArcColor(arcData[arcId].color)
        .toIpsumColor({ saturation: 30, lightness: 90 })
        .toRgbaCSS()
    : "white";

  const onArcClick = useCallback(
    (arcId?: string) => {
      arcId && openArcDetail(0, arcId);
    },
    [openArcDetail]
  );

  return (
    <Card className={styles["box"]} sx={{ backgroundColor: cardColor }}>
      <HighlightExcerpt highlightId={highlightId} />
      <div className={styles["details"]}>
        <div className={styles["details-left"]}>
          <IconButton size="small">
            <Comment />
          </IconButton>
        </div>
        <div className={styles["details-right"]}>
          relates to&nbsp;
          <ArcTag
            arcForToken={{
              type: "from id",
              id: highlightData[highlightId]?.arcId,
            }}
            onClick={onArcClick}
          ></ArcTag>
        </div>
      </div>
    </Card>
  );
};
