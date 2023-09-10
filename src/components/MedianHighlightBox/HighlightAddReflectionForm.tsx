import { useQuery } from "@apollo/client";
import { Button, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { gql, createSRSCard, deleteSRSCard } from "util/apollo";
import styles from "./HighlightAddReflectionForm.less";

const HighlightAddReflectionFormQuery = gql(`
  query HighlightAddReflectionForm($highlightId: ID!) {
    highlights(ids: [$highlightId]) {
      id
      srsCards {
        id
      }
    }
  }
`);

interface HighlightAddReflectionFormProps {
  highlightId: string;
}

export const HighlightAddReflectionForm: React.FunctionComponent<
  HighlightAddReflectionFormProps
> = ({ highlightId }) => {
  const { data } = useQuery(HighlightAddReflectionFormQuery, {
    variables: { highlightId },
  });

  const srsCardId = data?.highlights[0]?.srsCards[0]?.id;

  const onCreateClick = useCallback(() => {
    createSRSCard({
      subjectId: highlightId,
      subjectType: "Highlight",
    });
  }, [highlightId]);

  const onDeleteClick = useCallback(() => {
    if (!srsCardId) {
      return;
    }
    deleteSRSCard({ cardId: srsCardId });
  }, [srsCardId]);

  return (
    <div className={styles["reflection-form-container"]}>
      {srsCardId ? (
        <>
          <Typography>Reflections</Typography>
          <Button onClick={onDeleteClick}>Delete</Button>
        </>
      ) : (
        <>
          <Typography>Add SRS card</Typography>
          <Button onClick={onCreateClick}>Create</Button>
        </>
      )}
    </div>
  );
};
