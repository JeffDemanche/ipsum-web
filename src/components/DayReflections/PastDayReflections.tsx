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

const PastDayReflectionsQuery = gql(`
  query PastDayReflections($deckId: ID, $day: String!) {
    srsReviewsFromDay(deckId: $deckId, day: $day) {
      id
      rating
      card {
        id
      }
    }
  }
`);

export const PastDayReflections: React.FunctionComponent<
  DayReflectionsProps
> = ({ day }) => {
  const { data } = useQuery(PastDayReflectionsQuery, {
    variables: { day: day.toString(), deckId: "default" },
  });

  const reviews = data?.srsReviewsFromDay ?? [];

  const numReviews = reviews?.length ?? 0;

  return (
    <Accordion
      className={styles["reflection-accordion"]}
      defaultExpanded={false}
      variant="outlined"
    >
      <AccordionSummary expandIcon={<ExpandMore />} id="panel1a-header">
        <Typography variant="caption">
          Reflections ({numReviews} rated)
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles["day-reflections"]}>
          {reviews.map((review) => (
            <ReflectionCard
              key={review.card.id}
              locked
              lockedRating={review.rating}
              cardId={review.card.id}
            />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
