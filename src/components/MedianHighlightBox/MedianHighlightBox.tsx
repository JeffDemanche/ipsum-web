import { Close, Comment, Delete } from "@mui/icons-material";
import { Card, IconButton, Tooltip, Typography } from "@mui/material";
import { ArcTag } from "components/ArcTag";
import { DiptychContext } from "components/DiptychContext";
import { HighlightExcerpt } from "components/HighlightExcerpt";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { IpsumArcColor } from "util/colors";
import styles from "./MedianHighlightBox.less";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import cx from "classnames";
import { deleteHighlight, gql, removeHighlightFromEntry } from "util/apollo";
import { useQuery } from "@apollo/client";

interface MedianHighlightBoxProps {
  highlightId: string;
}

const MedianHighlightBoxQuery = gql(`
  query MedianHighlightBox($highlightId: ID!) {
    highlights(ids: [$highlightId]) {
      id
      arc {
        id
        color
      }
      entry {
        entryKey
      }
    }
  }
`);

export const MedianHighlightBox: React.FunctionComponent<
  MedianHighlightBoxProps
> = ({ highlightId }) => {
  const { data } = useQuery(MedianHighlightBoxQuery, {
    variables: { highlightId },
  });
  const highlight = data?.highlights?.[0];

  const { openArcDetail } = useContext(DiptychContext);

  const onArcClick = useCallback(
    (arcId?: string, e?: React.MouseEvent) => {
      e.stopPropagation();
      arcId && openArcDetail(0, arcId);
    },
    [openArcDetail]
  );

  const {
    selectedHighlightIds,
    setSelectedHighlightIds,
    hoveredHighlightIds,
    setHoveredHighlightIds,
  } = useContext(HighlightSelectionContext);

  const onCardClick = useCallback(
    (e: React.MouseEvent) => {
      setSelectedHighlightIds([highlightId]);
    },
    [highlightId, setSelectedHighlightIds]
  );

  const highlightHovered = hoveredHighlightIds?.includes(highlightId);
  const highlightBoxSelected = selectedHighlightIds.includes(highlightId);

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightBoxSelected) {
      boxRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [highlightBoxSelected]);

  const cardColor = useMemo(() => {
    let colorParams = { saturation: 30, lightness: 90 };
    if (highlightHovered) {
      colorParams = { saturation: 30, lightness: 80 };
    }
    if (highlightBoxSelected) {
      colorParams = { saturation: 40, lightness: 70 };
    }

    return highlight.arc?.id
      ? new IpsumArcColor(highlight.arc.color)
          .toIpsumColor(colorParams)
          .toRgbaCSS()
      : "white";
  }, [
    highlight?.arc.color,
    highlight.arc.id,
    highlightBoxSelected,
    highlightHovered,
  ]);

  const onCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedHighlightIds([]);
    },
    [setSelectedHighlightIds]
  );

  const onDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      removeHighlightFromEntry({
        entryKey: highlight.entry.entryKey,
        highlightId,
      });
      deleteHighlight(highlightId);
    },
    [highlight.entry.entryKey, highlightId]
  );

  return (
    <Card
      onMouseEnter={() => {
        setHoveredHighlightIds((highlightIds) => [
          ...(highlightIds ?? []),
          highlightId,
        ]);
      }}
      onMouseLeave={() => {
        setHoveredHighlightIds((highlightIds) =>
          highlightIds?.filter((id) => id !== highlightId)
        );
      }}
      onClick={onCardClick}
      className={cx(highlightBoxSelected && styles["selected"], styles["box"])}
      sx={{ backgroundColor: cardColor }}
      ref={boxRef}
    >
      <div
        className={cx(
          highlightBoxSelected && styles["selected"],
          styles["top-controls-container"]
        )}
      >
        <Tooltip title="Close highlight">
          <IconButton size="small" onClick={onCloseClick}>
            <Close />
          </IconButton>
        </Tooltip>
        <Tooltip className={styles["delete-button"]} title="Delete highlight">
          <IconButton size="small" onClick={onDeleteClick}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
      <HighlightExcerpt highlightId={highlightId} />
      <div className={styles["details"]}>
        <div className={styles["details-left"]}>
          <IconButton size="small">
            <Comment />
          </IconButton>
        </div>
        <div className={styles["details-right"]}>
          <Typography>relates to&nbsp;</Typography>
          <ArcTag
            arcForToken={{
              type: "from id",
              id: highlight?.arc.id,
            }}
            onClick={onArcClick}
          ></ArcTag>
        </div>
      </div>
    </Card>
  );
};
