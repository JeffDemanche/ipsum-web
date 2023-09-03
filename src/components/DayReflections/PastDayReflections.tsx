import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
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
    }
  }
`);

export const PastDayReflections: React.FunctionComponent<
  DayReflectionsProps
> = ({ day }) => {
  const { data } = useQuery(PastDayReflectionsQuery, {
    variables: { day: day.toString(), deckId: "default" },
  });

  const cards = data?.srsReviewsFromDay ?? [];

  const numCards = cards?.length ?? 0;

  return (
    <div className={styles["day-reflections"]}>
      <Typography variant="caption">Reviewed on day</Typography>
      {cards?.length && <ReflectionCard locked cardId={cards[0].id} />}
    </div>
  );
};
