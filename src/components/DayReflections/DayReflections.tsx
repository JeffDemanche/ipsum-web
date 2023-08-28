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

const DayReflectionsQuery = gql(`
  query DayReflections($day: String!) {
    srsCardsForDay(day: $day) {
      id
      lastReviewed
    }
  }
`);

export const DayReflections: React.FunctionComponent<DayReflectionsProps> = ({
  day,
}) => {
  const { data } = useQuery(DayReflectionsQuery, {
    variables: { day: day.toString() },
  });

  const cards = data?.srsCardsForDay;

  const numCards = cards?.length ?? 0;

  return (
    <div className={styles["day-reflections"]}>
      <Typography variant="caption">Reflections (0 / {numCards})</Typography>
      {cards?.length && <ReflectionCard cardId={cards[0].id} />}
    </div>
  );
};
