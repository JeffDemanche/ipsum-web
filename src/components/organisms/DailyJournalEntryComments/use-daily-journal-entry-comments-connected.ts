import { useQuery } from "@apollo/client";
import {
  apiCreateHighlight,
  apiDeleteCommentEntry,
  apiDeleteHighlight,
  apiUpdateCommentEntry,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

import type { DailyJournalEntryComments } from "./DailyJournalEntryComments";

export type DailyJournalEntryCommentsConnectedProps = Pick<
  React.ComponentProps<typeof DailyJournalEntryComments>,
  | "comments"
  | "today"
  | "onCreateCommentEntry"
  | "onUpdateCommentEntry"
  | "onDeleteCommentEntry"
  | "onCreateCommentHighlight"
  | "onDeleteCommentHighlight"
  | "onCommentHighlightClick"
  | "onCommentHighlightObjectClick"
>;

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
          object {
            __typename
            ... on Day {
              day
            }
            ... on Arc {
              id
            }
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
}: UseDailyJournalEntryCommentsConnectedProps): DailyJournalEntryCommentsConnectedProps => {
  const { data } = useQuery(UseDailyJournalEntryCommentsConnectedQuery, {
    variables: {
      day: day.toString("stored-day"),
    },
  });

  const comments: DailyJournalEntryCommentsConnectedProps["comments"] =
    data?.day?.comments.map((comment) => ({
      id: comment.id,
      day,
      highlight: {
        id: comment.objectHighlight.id,
        objectText: comment.objectHighlight.objectText,
        hue: comment.objectHighlight.hue,
        highlightNumber: comment.objectHighlight.number,
        arcNames: comment.objectHighlight.arcs.map((arc) => arc.name),
        object: comment.objectHighlight.object,
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

  const [updateCommentEntry] = useApiAction(apiUpdateCommentEntry);

  const [deleteCommentEntry] = useApiAction(apiDeleteCommentEntry);

  const [createHighlight] = useApiAction(apiCreateHighlight);

  const [deleteHighlight] = useApiAction(apiDeleteHighlight);

  const insertLayer = useUrlAction(urlInsertLayer);

  const onCreateCommentEntry: DailyJournalEntryCommentsConnectedProps["onCreateCommentEntry"] =
    (commentId, htmlString) => {
      // This is a noop; you shouldn't be able to create comments through the daily journal.
      return "";
    };

  const onUpdateCommentEntry: DailyJournalEntryCommentsConnectedProps["onUpdateCommentEntry"] =
    (commentId, args) => {
      return updateCommentEntry(args);
    };

  const onDeleteCommentEntry: DailyJournalEntryCommentsConnectedProps["onDeleteCommentEntry"] =
    (commentId, entryKey) => {
      deleteCommentEntry({ entryKey });
    };

  const onCreateCommentHighlight: DailyJournalEntryCommentsConnectedProps["onCreateCommentHighlight"] =
    (commentId) => {
      return createHighlight({ entryKey: `comment-entry:${commentId}` }).id;
    };

  const onDeleteCommentHighlight: DailyJournalEntryCommentsConnectedProps["onDeleteCommentHighlight"] =
    (commentId, highlightId) => {
      deleteHighlight({ id: highlightId });
    };

  const onCommentHighlightClick: DailyJournalEntryCommentsConnectedProps["onCommentHighlightClick"] =
    (commentId, highlightId) => {
      insertLayer({
        layer: {
          type: "highlight_detail",
          highlightId,
          expanded: "true",
        },
      });
    };

  const onCommentHighlightObjectClick: DailyJournalEntryCommentsConnectedProps["onCommentHighlightObjectClick"] =
    (commentId, args) => {
      switch (args.object.__typename) {
        case "Day":
          insertLayer({
            layer: {
              type: "daily_journal",
              day: IpsumDay.fromString(
                args.object.day,
                "entry-printed-date"
              ).toString("url-format"),
              expanded: "true",
            },
          });
          break;
        case "Arc":
          insertLayer({
            layer: {
              type: "arc_detail",
              arcId: args.object.id,
              expanded: "true",
            },
          });
          break;
      }
    };

  return {
    today: IpsumDay.today(),
    comments,
    onCreateCommentEntry,
    onUpdateCommentEntry,
    onDeleteCommentEntry,
    onCreateCommentHighlight,
    onDeleteCommentHighlight,
    onCommentHighlightClick,
    onCommentHighlightObjectClick,
  };
};
