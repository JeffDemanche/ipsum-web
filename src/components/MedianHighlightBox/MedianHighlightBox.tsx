import { ArrowLeftRounded, Comment, Delete } from "@mui/icons-material";
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
import { parseIpsumDateTime } from "util/dates";
import { theme } from "styles/styles";
import { dataToSearchParams, urlToData } from "util/url";
import { useNavigate } from "react-router";
import { Linker } from "components/Linker";

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
        date
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

  const entryDate = parseIpsumDateTime(data.highlights[0].entry.date).toString(
    "entry-printed-date-nice"
  );

  const { setTopLayer, setTopConnection } = useContext(DiptychContext);

  const onArcClick = useCallback(
    (arcId?: string, e?: React.MouseEvent) => {
      e.stopPropagation();
      arcId &&
        setTopLayer({ type: "arc_detail", connectionId: highlightId, arcId });
    },
    [highlightId, setTopLayer]
  );

  const {
    selectedHighlightIds,
    setSelectedHighlightIds,
    hoveredHighlightIds,
    setHoveredHighlightIds,
  } = useContext(HighlightSelectionContext);

  const navigate = useNavigate();

  const onCardClick = useCallback(() => {
    setSelectedHighlightIds([highlightId]);

    const searchParams = urlToData<"journal">(window.location.href);
    if (searchParams.layers[0]?.type === "daily_journal") {
      const highlightEntryDate = parseIpsumDateTime(highlight.entry.date);
      searchParams.layers[0].startDate =
        highlightEntryDate.toString("url-format");
      searchParams.layers[0].endDate =
        highlightEntryDate.toString("url-format");
    }
    navigate({ search: dataToSearchParams(searchParams) }, { replace: true });
  }, [highlight.entry.date, highlightId, navigate, setSelectedHighlightIds]);

  const highlightHovered = hoveredHighlightIds?.includes(highlightId);
  const highlightBoxSelected = selectedHighlightIds.includes(highlightId);

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightBoxSelected) {
      boxRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [highlightBoxSelected]);

  const cardColor = useMemo(() => {
    let colorParams = { saturation: 30, lightness: 40 };
    if (highlightHovered) {
      colorParams = { saturation: 30, lightness: 30 };
    }
    if (highlightBoxSelected) {
      colorParams = { saturation: 20, lightness: 20 };
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
      setTopConnection(undefined);
    },
    [setSelectedHighlightIds, setTopConnection]
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
      {highlightBoxSelected ? (
        <div
          className={cx(
            styles["selected"],
            styles["details-controls-container"]
          )}
        >
          <div className={styles["details-options"]}>
            <Tooltip title="Close highlight">
              <IconButton size="small" color="secondary" onClick={onCloseClick}>
                <ArrowLeftRounded />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              color={theme.palette.onPrimaryHighEmphasis}
              className={styles["highlight-title"]}
            >
              {entryDate}
            </Typography>
            <div className={styles["options-buttons"]}>
              <Tooltip title="Comment">
                <IconButton color="secondary" size="small">
                  <Comment />
                </IconButton>
              </Tooltip>
              <Tooltip
                className={styles["delete-button"]}
                title="Delete highlight"
              >
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={onDeleteClick}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className={styles["details-relations"]}>
            <div className={styles["relations-right"]}>
              <div className={styles["relation"]}>
                <Typography
                  variant="body2"
                  display="flex"
                  color={theme.palette.onPrimaryHighEmphasis}
                >
                  relates to&nbsp;
                </Typography>
                <ArcTag
                  arcForToken={{
                    type: "from id",
                    id: highlight?.arc.id,
                  }}
                  onClick={onArcClick}
                ></ArcTag>
              </div>
              <div>
                <Linker className={styles["linker"]}></Linker>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={cx(styles["top-controls-container"])}>
          <Typography
            variant="h6"
            color={theme.palette.onPrimaryHighEmphasis}
            className={styles["highlight-title"]}
          >
            {entryDate}
          </Typography>
        </div>
      )}

      <HighlightExcerpt highlightId={highlightId} />
    </Card>
  );
};
