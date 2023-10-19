import { useQuery } from "@apollo/client";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ReflectionCard } from "components/ReflectionCard";
import React from "react";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import styles from "./DayReflections.less";

interface DayReflectionsProps {
  day: IpsumDay;
}

const TodayDayReflectionsQuery = gql(`
  query TodayDayReflections($deckId: ID, $day: String!) {
    srsCardsForReview(deckId: $deckId, day: $day) {
      id
      lastReviewed
    }
    srsReviewsFromDay(deckId: $deckId, day: $day) {
      id
      rating
      beforeEF
      beforeInterval
      card {
        id
      }
    }
  }
`);

export const TodayDayReflections: React.FunctionComponent<
  DayReflectionsProps
> = ({ day }) => {
  const { data } = useQuery(TodayDayReflectionsQuery, {
    variables: { day: day.toString(), deckId: "default" },
  });

  const unreviewedCards = data?.srsCardsForReview ?? [];

  const reviewedCards = data?.srsReviewsFromDay ?? [];

  const numUnreviewedCards = unreviewedCards?.length ?? 0;
  const numReviewedCards = reviewedCards?.length ?? 0;

  return (
    <Accordion
      className={styles["reflection-accordion"]}
      defaultExpanded
      variant="outlined"
    >
      <AccordionSummary expandIcon={<ExpandMore />} id="panel1a-header">
        <Typography variant="caption">
          Reflections ({numReviewedCards} rated / {numUnreviewedCards} unrated)
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles["day-reflections"]}>
          <Typography variant="h4">Today&apos;s reflections</Typography>
          <Typography variant="caption">
            ({numReviewedCards} rated / {numUnreviewedCards} unrated)
          </Typography>
          {unreviewedCards?.length > 0 && (
            <ReflectionCard cardId={unreviewedCards[0].id} />
          )}
          {reviewedCards?.map((review) => (
            <ReflectionCard
              key={review.id}
              cardId={review.card.id}
              beforeReview={{
                ef: review.beforeEF,
                rating: review.rating,
                interval: review.beforeInterval,
              }}
            />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
