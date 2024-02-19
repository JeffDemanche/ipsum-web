import { useQuery } from "@apollo/client";
import { StarHalf } from "@mui/icons-material";
import { ToggleButton, Tooltip } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { gql, rateHighlightImportance } from "util/apollo";
import { IpsumDay } from "util/dates";

interface ImportanceRatingButtonProps {
  highlightId: string;
  disabled?: boolean;
}

const ImportanceRatingButtonQuery = gql(`
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

export const ImportanceRatingButton: React.FunctionComponent<
  ImportanceRatingButtonProps
> = ({ highlightId, disabled }) => {
  const { data } = useQuery(ImportanceRatingButtonQuery, {
    variables: { highlightId },
  });

  const importanceRating = data?.highlight?.currentImportance ?? 0;

  const isRatedToday = useMemo(
    () =>
      data?.highlight.importanceRatings.find(
        (rating) => rating.day.day === IpsumDay.today().toString("stored-day")
      ) !== undefined,
    [data?.highlight.importanceRatings]
  );

  const onRateClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      rateHighlightImportance({
        highlightId,
        rating: isRatedToday ? 0 : 1,
      });
    },
    [highlightId, isRatedToday]
  );

  return (
    <Tooltip title="Rate as important">
      <ToggleButton
        value="rated"
        size="small"
        selected={isRatedToday}
        onClick={onRateClick}
        disabled={disabled}
      >
        <StarHalf scale={0.5} />
        {importanceRating.toFixed(2)}
      </ToggleButton>
    </Tooltip>
  );
};
