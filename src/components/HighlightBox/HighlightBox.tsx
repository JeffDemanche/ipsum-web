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
import styles from "./HighlightBox.less";
import cx from "classnames";
import {
  createArc,
  createRelation,
  deleteHighlight,
  gql,
  removeHighlightFromEntry,
} from "util/apollo";
import { useQuery } from "@apollo/client";
import { IpsumDateTime, IpsumDay, parseIpsumDateTime } from "util/dates";
import { theme } from "styles/styles";
import { Linker } from "components/Linker";
import { HighlightAddReflectionForm } from "./HighlightAddReflectionForm";

interface HighlightBoxProps {
  highlightId: string;
  variant?: "collapsed" | "expanded";

  selected?: boolean;
  onSelect?: (selected: boolean, day: IpsumDay) => void;

  hovered?: boolean;
  onHover?: (hovered: boolean) => void;
}

const HighlightBoxQuery = gql(`
  query HighlightBox($highlightId: ID!) {
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

export const HighlightBox: React.FunctionComponent<HighlightBoxProps> = ({
  highlightId,
  variant = "expanded",
  selected,
  onSelect,
  hovered,
  onHover,
}) => {
  const { data } = useQuery(HighlightBoxQuery, {
    variables: { highlightId },
  });
  const highlight = data?.highlights?.[0];
  const highlightRelations = highlight.outgoingRelations;
  const firstArc = highlightRelations[0]?.object;

  const entryDate = parseIpsumDateTime(data.highlights[0].entry.date).toString(
    "entry-printed-date-nice"
  );

  const { pushLayer, popHighlights } = useContext(DiptychContext);

  const onArcClick = useCallback(
    (arcId?: string, e?: React.MouseEvent) => {
      e.stopPropagation();
      arcId && pushLayer({ type: "arc_detail", arcId });
    },
    [pushLayer]
  );

  const onCardClick = useCallback(() => {
    const highlightDay = IpsumDay.fromIpsumDateTime(
      parseIpsumDateTime(highlight.entry.date)
    );

    onSelect?.(!selected, highlightDay);
  }, [highlight.entry.date, onSelect, selected]);

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      boxRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [selected]);

  const cardColor = useMemo(() => {
    let colorParams = { saturation: 30, lightness: 40 };
    if (hovered) {
      colorParams = { saturation: 30, lightness: 30 };
    }
    if (selected) {
      colorParams = { saturation: 20, lightness: 20 };
    }

    return firstArc?.id
      ? new IpsumArcColor(firstArc.color).toIpsumColor(colorParams).toRgbaCSS()
      : "white";
  }, [firstArc?.color, firstArc?.id, hovered, selected]);

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
            color={theme.palette.onSurfaceMediumEmphasis}
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

  const onDateClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      pushLayer({
        type: "daily_journal",
        mode: "past",
        visibleDates: [
          IpsumDateTime.fromString(highlight.entry.date, "iso").toString(
            "url-format"
          ),
        ],
      });
    },
    [highlight.entry.date, pushLayer]
  );

  return (
    <Card
      onMouseEnter={() => {
        onHover?.(true);
      }}
      onMouseLeave={() => {
        onHover?.(false);
      }}
      variant="translucent"
      onClick={onCardClick}
      className={cx(selected && styles["selected"], styles["box"])}
      ref={boxRef}
    >
      {selected ? (
        <div
          className={cx(
            styles["selected"],
            styles["details-controls-container"]
          )}
        >
          <div className={styles["details-options"]}>
            <Tooltip
              title="Deselect highlight"
              onClick={(e) => {
                // TODO make this smarter once the highlights have been fleshed
                // out.
                e.stopPropagation();
                popHighlights();
              }}
            >
              <IconButton size="small" color="default">
                <ArrowLeftRounded />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" className={styles["highlight-title"]}>
              <a onClick={onDateClick} href="#">
                {entryDate}
              </a>
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
            <a onClick={onDateClick} href="#">
              {entryDate}
            </a>
          </Typography>
        </div>
      )}

      {variant !== "collapsed" && (
        <HighlightExcerpt
          className={styles["excerpt"]}
          highlightId={highlightId}
          charLimit={selected ? undefined : 200}
        />
      )}
    </Card>
  );
};
