import { useQuery } from "@apollo/client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { HighlightExcerpt } from "components/HighlightExcerpt";
import { HighlightTag } from "components/HighlightTag";
import React from "react";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

interface JournalEntryCommentsProps {
  day: IpsumDay;
}

const JournalEntryCommentsQuery = gql(`
  query JournalEntryComments($dayIso: String!) {
    commentsForDay(day: $dayIso) {
      id
      commentEntry {
        entry {
          entryKey
          htmlString
        }
      }
      highlight {
        id
        history{
          dateCreated
        }
        excerpt
      }
    }
  }
`);

export const JournalEntryComments: React.FunctionComponent<
  JournalEntryCommentsProps
> = ({ day }) => {
  const { data } = useQuery(JournalEntryCommentsQuery, {
    variables: {
      dayIso: day.toString("iso"),
    },
  });

  const comments = data.commentsForDay;

  return (
    <div>
      {comments.map((comment) => {
        return (
          <Accordion key={comment.id}>
            <AccordionSummary>
              <HighlightExcerpt
                dataHighlightId={comment.highlight.id}
                excerpt={comment.commentEntry.entry.htmlString}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption">In response to:</Typography>
              <HighlightTag highlightId={comment.highlight.id} />
              <HighlightExcerpt
                dataHighlightId={comment.highlight.id}
                excerpt={comment.highlight.excerpt}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};
