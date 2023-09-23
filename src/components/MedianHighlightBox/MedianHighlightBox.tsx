import {
  ArrowLeftRounded,
  Comment,
  Delete,
  ThreeSixty,
} from "@mui/icons-material";
import { Card, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import { ArcTag } from "components/ArcTag";
import { DiptychContext } from "components/DiptychContext";
import { HighlightExcerpt } from "components/HighlightExcerpt";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IpsumArcColor } from "util/colors";
import styles from "./MedianHighlightBox.less";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import cx from "classnames";
import {
  createArc,
  createRelation,
  deleteHighlight,
  gql,
  removeHighlightFromEntry,
} from "util/apollo";
import { useQuery } from "@apollo/client";
import { IpsumDay, parseIpsumDateTime } from "util/dates";
import { theme } from "styles/styles";
import { useModifySearchParams } from "util/url";
import { Linker } from "components/Linker";
import { HighlightAddReflectionForm } from "./HighlightAddReflectionForm";

interface MedianHighlightBoxProps {
  highlightId: string;
}

const MedianHighlightBoxQuery = gql(`
  query MedianHighlightBox($highlightId: ID!) {
    highlights(ids: [$highlightId]) {
      id
      entry {
        entryKey
        date
      }
      outgoingRelations {
        __typename
        predicate
        object {
          ... on Arc {
            id
            color
          }
        }
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
  const highlightRelations = highlight.outgoingRelations;
  const firstArc = highlightRelations[0].object;

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

  const modifySearchParams = useModifySearchParams<"journal">();

  const onCardClick = useCallback(() => {
    const highlightDay = IpsumDay.fromIpsumDateTime(
      parseIpsumDateTime(highlight.entry.date)
    );

    modifySearchParams((searchParams) => ({
      ...searchParams,
      layers: [
        {
          ...searchParams.layers[0],
          focusedDate: highlightDay.toString("url-format"),
        },
        ...searchParams.layers.slice(1),
      ],
    }));
  }, [highlight.entry.date, modifySearchParams]);

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

    return firstArc?.id
      ? new IpsumArcColor(firstArc.color).toIpsumColor(colorParams).toRgbaCSS()
      : "white";
  }, [firstArc.color, firstArc?.id, highlightBoxSelected, highlightHovered]);

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

  const linkArc = useCallback(
    (arcId: string) => {
      createRelation({
        subject: highlight.id,
        subjectType: "Highlight",
        predicate: "relates to",
        object: arcId,
        objectType: "Arc",
      });
    },
    [highlight.id]
  );

  const createAndLinkArc = useCallback(
    (name: string) => {
      const arc = createArc({ name });
      linkArc(arc.id);
    },
    [linkArc]
  );

  const relationsMarkup = useMemo(
    () =>
      highlightRelations.map((relation, i) => (
        <div className={styles["relation"]} key={i}>
          <Typography
            variant="body2"
            display="flex"
            color={theme.palette.onPrimaryHighEmphasis}
          >
            {relation.predicate}&nbsp;
          </Typography>
          <ArcTag
            arcForToken={{
              type: "from id",
              id: relation.object.id,
            }}
            onClick={onArcClick}
          ></ArcTag>
        </div>
      )),
    [highlightRelations, onArcClick]
  );

  const [reflectionPopoverOpen, setReflectionPopoverOpen] = useState(false);

  const reflectionButtonRef = useRef<HTMLButtonElement>(null);

  const onReflectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setReflectionPopoverOpen((open) => !open);
  }, []);

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
      variant="shadowed"
      onClick={onCardClick}
      className={cx(highlightBoxSelected && styles["selected"], styles["box"])}
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
              <IconButton size="small" color="default" onClick={onCloseClick}>
                <ArrowLeftRounded />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" className={styles["highlight-title"]}>
              {entryDate}
            </Typography>
            <div className={styles["options-buttons"]}>
              <Popover
                open={reflectionPopoverOpen}
                anchorEl={reflectionButtonRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                onClose={() => setReflectionPopoverOpen(false)}
              >
                <HighlightAddReflectionForm
                  highlightId={highlightId}
                ></HighlightAddReflectionForm>
              </Popover>
              <Tooltip title="Reflections">
                <IconButton
                  color="default"
                  size="small"
                  onClick={onReflectionClick}
                  ref={reflectionButtonRef}
                >
                  <ThreeSixty />
                </IconButton>
              </Tooltip>
              <Tooltip title="Comment">
                <IconButton color="default" size="small">
                  <Comment />
                </IconButton>
              </Tooltip>
              <Tooltip
                className={styles["delete-button"]}
                title="Delete highlight"
              >
                <IconButton
                  color="default"
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
              <div className={styles["relations"]}>{relationsMarkup}</div>
              <div>
                <Linker
                  onAddArc={createAndLinkArc}
                  onChooseArc={linkArc}
                  className={styles["linker"]}
                ></Linker>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={cx(styles["top-controls-container"])}>
          <Typography variant="h6" className={styles["highlight-title"]}>
            {entryDate}
          </Typography>
        </div>
      )}

      <HighlightExcerpt highlightId={highlightId} />
    </Card>
  );
};
