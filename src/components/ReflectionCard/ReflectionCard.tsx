import { useQuery } from "@apollo/client";
import {
  Brightness1TwoTone,
  Brightness2TwoTone,
  Brightness3TwoTone,
  Brightness4TwoTone,
  Brightness6TwoTone,
  Brightness7TwoTone,
} from "@mui/icons-material";
import {
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { HighlightBox } from "components/HighlightBox";
import React, { useCallback } from "react";
import { gql, reviewSRSCard } from "util/apollo";
import { calculateNextInterval } from "util/srs";
import styles from "./ReflectionCard.less";

interface ReflectionCardProps {
  locked?: boolean;
  lockedRating?: number;
  cardId: string;
  beforeReview?: {
    ef: number;
    rating: number;
    interval: number;
  };
}

const ReflectionCardQuery = gql(`
  query ReflectionCard($cardId: ID!) {
    srsCard(id: $cardId) {
      id
      interval
      ef
      subject {
        __typename
        ... on Highlight {
          id
          entry {
            entryKey
          }
        }
        ... on Arc {
          id
          name
        }
      }
    }
  }
`);

export const ReflectionCard: React.FunctionComponent<ReflectionCardProps> = ({
  locked = false,
  lockedRating,
  cardId,
  beforeReview,
}) => {
  const { data } = useQuery(ReflectionCardQuery, {
    variables: { cardId },
  });

  const srsCard = data?.srsCard;

  const submitRating = useCallback(
    (rating: number) => {
      reviewSRSCard({ cardId: srsCard?.id, rating });
    },
    [srsCard?.id]
  );

  const subjectType = data?.srsCard.subject.__typename;

  const ratings = [0, 1, 2, 3, 4, 5];

  if (subjectType === "Highlight") {
    return (
      <Paper className={styles["reflection-card"]}>
        <HighlightBox highlightId={data.srsCard.subject.id} />
        <div className={styles["rating-container"]}>
          <ToggleButtonGroup className={styles["rating-button-group"]}>
            {ratings.map((i) => {
              const nextInterval = beforeReview
                ? calculateNextInterval(
                    beforeReview.interval,
                    beforeReview.ef,
                    i
                  )
                : calculateNextInterval(srsCard.interval, srsCard.ef, i);
              return (
                <ToggleButton
                  key={i}
                  value={i}
                  selected={
                    locked ? lockedRating === i : beforeReview?.rating === i
                  }
                  onClick={() => submitRating(i)}
                  disabled={locked}
                  className={styles["rating-button"]}
                >
                  {
                    {
                      0: <Brightness1TwoTone />,
                      1: <Brightness2TwoTone />,
                      2: <Brightness3TwoTone />,
                      3: <Brightness4TwoTone />,
                      4: <Brightness6TwoTone />,
                      5: <Brightness7TwoTone />,
                    }[5 - i]
                  }
                  <Typography className={styles["rating-label"]}>
                    {nextInterval.nextInterval.toFixed(1)}d
                  </Typography>
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </div>
      </Paper>
    );
  } else if (subjectType === "Arc") {
    return (
      <Paper className={styles["reflection-card"]}>
        Arc reflections not implemented
      </Paper>
    );
  } else {
    return null;
  }
};
