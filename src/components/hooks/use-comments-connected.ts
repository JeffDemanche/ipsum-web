import { useQuery } from "@apollo/client";
import { Comments } from "components/molecules/Comments";
import { useMemo, useState } from "react";
import {
  apiCreateComment,
  apiUpdateJournalEntry,
  useApiAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { replaceHighlightHtmlWith } from "util/excerpt";
import { v4 as uuidv4 } from "uuid";

export type CommentsConnectedProps = Pick<
  React.ComponentProps<typeof Comments>,
  | "today"
  | "selectedDay"
  | "setSelectedDay"
  | "comments"
  | "pregeneratedHighlightId"
  | "onCreateComment"
  | "onUpdateComment"
  | "onDeleteComment"
  | "onCreateHighlight"
  | "onDeleteHighlight"
  | "onHighlightClick"
>;

const UseCommentsConnectedQuery = gql(`
  query UseCommentsConnected($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      comments {
        id
        history {
          dateCreated
        }
        sourceHighlight {
          id
        }
        sourceEntry {
          entry {
            entryKey
            highlights {
              id
              number
              hue
              outgoingRelations {
                object {
                  ... on Arc {
                    name
                  }
                }
              }
            }
            htmlString
          }
        }
      }
    }
  }
`);

interface UseCommentsConnectedProps {
  highlightId: string;
}

export const useCommentsConnected = ({
  highlightId,
}: UseCommentsConnectedProps): CommentsConnectedProps => {
  const today = IpsumDay.today();

  const [selectedDay, setSelectedDay] = useState(today);

  const { data } = useQuery(UseCommentsConnectedQuery, {
    variables: {
      highlightId,
    },
  });

  const comments: CommentsConnectedProps["comments"] =
    data?.highlight.comments.map((comment) => ({
      id: comment.id,
      day: IpsumDay.fromString(comment.history.dateCreated, "iso"),
      sourceHighlight: comment.sourceHighlight.id,
      sourceEntry: {
        entryKey: comment.sourceEntry.entry.entryKey,
        highlights: comment.sourceEntry.entry.highlights.map((highlight) => ({
          highlightId: highlight.id,
          highlightNumber: highlight.number,
          hue: highlight.hue,
          arcNames: highlight.outgoingRelations
            .map((relation) =>
              relation.object.__typename === "Arc"
                ? relation.object.name
                : undefined
            )
            .filter(Boolean),
        })),
        htmlString: comment.sourceEntry.entry.htmlString,
      },
    }));

  const [createComment] = useApiAction(apiCreateComment);

  const [updateEntry] = useApiAction(apiUpdateJournalEntry);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pregeneratedHighlightId = useMemo(() => uuidv4(), [selectedDay]);

  const onCreateComment = (htmlString: string) => {
    const newComment = createComment({
      highlightId: pregeneratedHighlightId,
      dayCreated: selectedDay,
      htmlString,
      objectHighlight: highlightId,
    });
    return newComment.sourceEntry;
  };

  const selectedComment = comments.find((comment) =>
    comment.day.equals(selectedDay)
  );

  const onUpdateComment = ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => {
    if (!selectedComment) return;

    return updateEntry({
      entryKey,
      htmlString: replaceHighlightHtmlWith(
        selectedComment.sourceEntry.htmlString,
        htmlString,
        highlightId
      ),
    });
  };

  return {
    today,
    selectedDay,
    setSelectedDay,
    comments: comments ?? [],
    pregeneratedHighlightId,
    onCreateComment,
    onUpdateComment,
    onDeleteComment: () => true,
    onCreateHighlight: () => "",
    onDeleteHighlight: () => false,
    onHighlightClick: () => "",
  };
};
