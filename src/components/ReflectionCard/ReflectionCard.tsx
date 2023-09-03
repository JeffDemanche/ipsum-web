import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";
import styles from "./ReflectionCard.less";

interface ReflectionCardProps {
  cardId: string;
}

const ReflectionCardQuery = gql(`
  query ReflectionCard($cardId: ID!) {
    srsCard(id: $cardId) {
      id
    }
  }
`);

export const ReflectionCard: React.FunctionComponent<ReflectionCardProps> = ({
  cardId,
}) => {
  const { data } = useQuery(ReflectionCardQuery, { variables: { cardId } });

  return <div className={styles["reflection-card"]}>ReflectionCard</div>;
};