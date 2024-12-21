import { useQuery } from "@apollo/client";
import { CommentBlurb } from "components/molecules/CommentBlurb";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

export interface DailyJournalEntryCommentsConnectedProps {
  comments: {
    id: string;
    excerptProps: {
      htmlString: string;
      maxLines?: number;
    };
    day: IpsumDay;
    highlight: {
      id: string;
      objectText: string;
      hue: number;
      highlightNumber: number;
      arcNames: string[];
    };
    commentEntry: React.ComponentProps<
      typeof CommentBlurb
    >["comment"]["commentEntry"];
  }[];
}

const UseDailyJournalEntryCommentsConnectedQuery = gql(`
  query UseDailyJournalEntryCommentsConnected($day: String!) {
    day(day: $day) {
      comments {
        id
        htmlString
        commentEntry {
          entry {
            entryKey
            htmlString
            highlights {
              id
              number
              hue
              arcs {
                id
                name
              }
            }
          }
        }
        objectHighlight {
          id
          objectText
          hue
          number
          arcs {
            id
            name
          }
        }
      }
    }
  }  
`);

interface UseDailyJournalEntryCommentsConnectedProps {
  day: IpsumDay;
}

export const useDailyJournalEntryCommentsConnected = ({
  day,
}: UseDailyJournalEntryCommentsConnectedProps) => {
  const { data } = useQuery(UseDailyJournalEntryCommentsConnectedQuery, {
    variables: {
      day: day.toString("stored-day"),
    },
  });

  const comments: DailyJournalEntryCommentsConnectedProps["comments"] =
    data?.day.comments.map((comment) => ({
      id: comment.id,
      excerptProps: {
        htmlString: comment.htmlString,
      },
      day,
      highlight: {
        id: comment.objectHighlight.id,
        objectText: comment.objectHighlight.objectText,
        hue: comment.objectHighlight.hue,
        highlightNumber: comment.objectHighlight.number,
        arcNames: comment.objectHighlight.arcs.map((arc) => arc.name),
      },
      commentEntry: {
        htmlString: comment.commentEntry.entry.htmlString,
        highlights: comment.commentEntry.entry.highlights.map((highlight) => ({
          highlightId: highlight.id,
          highlightNumber: highlight.number,
          hue: highlight.hue,
          arcNames: highlight.arcs.map((arc) => arc.name),
        })),
      },
    }));

  return {
    comments,
  };
};
