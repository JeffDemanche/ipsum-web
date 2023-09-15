import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import { HighlightExcerpt } from "components/HighlightExcerpt";
import React from "react";
import { gql } from "util/apollo";
import styles from "./ReflectionCard.less";

interface ReflectionCardProps {
  locked?: boolean;
  cardId: string;
}

const ReflectionCardQuery = gql(`
  query ReflectionCard($cardId: ID!) {
    srsCard(id: $cardId) {
      id
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
  cardId,
}) => {
  const { data } = useQuery(ReflectionCardQuery, {
    variables: { cardId },
  });

  const subjectType = data?.srsCard.subject.__typename;
  if (subjectType === "Highlight") {
    return (
      <Paper className={styles["reflection-card"]}>
        <HighlightExcerpt highlightId={data.srsCard.subject.id} />
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
