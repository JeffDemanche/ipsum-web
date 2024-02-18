import { useQuery } from "@apollo/client";
import { ArrowLeftRounded, Delete, StarHalf } from "@mui/icons-material";
import { Button, IconButton, ToggleButton, Tooltip } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import React, { useCallback, useContext, useMemo } from "react";
import { deleteHighlight, gql, rateHighlightImportance } from "util/apollo";
import { IpsumDay } from "util/dates";
import styles from "./HighlightBox.less";

interface HighlightBoxButtonsProps {
  highlightId: string;
}

const HighlightBoxButtonsQuery = gql(`
  query HighlightBoxButtons($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      importanceRatings {
        value
        day {
          day
        }
      }
      currentImportance
    }
  }
`);

export const HighlightBoxButtons: React.FunctionComponent<
  HighlightBoxButtonsProps
> = ({ highlightId }) => {
  const { data } = useQuery(HighlightBoxButtonsQuery, {
    variables: { highlightId },
  });

  const { popHighlights } = useContext(DiptychContext);

  const onDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteHighlight(highlightId);
    },
    [highlightId]
  );

  const importanceRating = data?.highlight?.currentImportance ?? 0;

  const isRatedToday = useMemo(
    () =>
      data?.highlight.importanceRatings.find(
        (rating) => rating.day.day === IpsumDay.today().toString("stored-day")
      ) !== undefined,
    [data?.highlight.importanceRatings]
  );

  const onRateClick = useCallback(() => {
    rateHighlightImportance({
      highlightId,
      rating: isRatedToday ? 0 : 1,
    });
  }, [highlightId, isRatedToday]);

  return (
    <div className={styles["details-options"]}>
      <div className={styles["left-aligned"]}>
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
        <Tooltip title="Rate as important">
          <ToggleButton
            value="rated"
            size="small"
            selected={isRatedToday}
            onClick={onRateClick}
          >
            <StarHalf scale={0.5} />
            {importanceRating.toFixed(2)}
          </ToggleButton>
        </Tooltip>
      </div>
      <div className={styles["right-aligned"]}>
        <Tooltip className={styles["delete-button"]} title="Delete highlight">
          <Button size="small" startIcon={<Delete />} onClick={onDeleteClick}>
            Delete
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
