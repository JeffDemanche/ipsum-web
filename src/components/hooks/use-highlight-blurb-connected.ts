import { useQuery } from "@apollo/client";
import { HighlightBlurb } from "components/molecules/HighlightBlurb";
import { useMemo } from "react";
import {
  apiCreateSRSCard,
  apiDeleteHighlight,
  apiReviewSRSCard,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumSRSCard } from "util/repetition";

import { useHighlightRelationsTableConnected } from "./use-highlight-relations-table-connected";

export type HighlightBlurbConnectedProps = Pick<
  React.ComponentProps<typeof HighlightBlurb>,
  | "highlightProps"
  | "onDelete"
  | "excerptProps"
  | "onHighlightClick"
  | "onHighlightObjectClick"
  | "prospectiveIntervals"
  | "onRate"
  | "relations"
  | "relationsTableProps"
  | "onStartSRS"
  | "reviewState"
  | "today"
>;

const UseHighlightBlurbConnectedQuery = gql(`
  query UseHighlightBlurbConnected($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      excerpt
      hue
      number
      objectText
      importanceRatings {
        day {
          day
        }
      }
      outgoingRelations {
        id
        predicate
        object {
          ... on Arc {
            id
            name
            color
          }
        }
      }
      object {
        __typename
        ... on Arc {
          id
        }
        ... on Day {
          day
        }
        ... on Comment {
          id
          highlight {
            id
          }
        }
      }
      history {
        dateCreated
      }
      srsCard  {
        id
        upForReview
        history {
          dateCreated
        }
        reviews {
          day {
            day
          }
          rating
          easeBefore
          easeAfter
          intervalBefore
          intervalAfter
        }
        prospectiveIntervals(day: null)
      }
    }
  }  
`);

export const useHighlightBlurbConnected = ({
  highlightId,
}: {
  highlightId: string;
}): HighlightBlurbConnectedProps => {
  const { data } = useQuery(UseHighlightBlurbConnectedQuery, {
    variables: { highlightId },
  });

  const insertLayer = useUrlAction(urlInsertLayer);

  const [deleteHighlight] = useApiAction(apiDeleteHighlight);

  const [createSRSCard] = useApiAction(apiCreateSRSCard);

  const [reviewSRSCard] = useApiAction(apiReviewSRSCard);

  const highlight = data?.highlight;

  const relationsTableProps = useHighlightRelationsTableConnected();

  const highlightProps: HighlightBlurbConnectedProps["highlightProps"] = {
    highlightId,
    objectText: highlight.objectText,
    hue: highlight.hue,
    highlightNumber: highlight.number,
    arcNames: highlight.outgoingRelations.map(
      (relation) => relation.object.name
    ),
    importanceRating: 0,
  };

  const excerptProps: HighlightBlurbConnectedProps["excerptProps"] = {
    htmlString: highlight.excerpt,
    maxLines: 5,
  };

  const arcRelations = highlight.outgoingRelations.filter(
    (relation) => relation.object && relation.object.__typename === "Arc"
  );

  const relations: HighlightBlurbConnectedProps["relations"] = arcRelations.map(
    (relation) => ({
      id: relation.id,
      predicate: relation.predicate,
      arc: {
        id: relation.object.id,
        hue: relation.object.color,
        name: relation.object.name,
      },
    })
  );

  const onHighlightClick = () => {
    insertLayer({
      layer: { type: "highlight_detail", highlightId, expanded: "true" },
    });
  };

  const onHighlightObjectClick = () => {
    switch (highlight.object.__typename) {
      case "Day":
        insertLayer({
          layer: {
            type: "daily_journal",
            day: IpsumDay.fromString(
              highlight.object.day,
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
            arcId: highlight.object.id,
            expanded: "true",
          },
        });
        break;
      case "Comment":
        insertLayer({
          layer: { type: "highlight_detail", highlightId, expanded: "true" },
        });
    }
  };

  const onDelete = () => {
    deleteHighlight({ id: highlightId });
  };

  const onStartSRS = () => {
    createSRSCard({ subject: highlightId, subjectType: "Highlight" });
  };

  const srsCard = highlight.srsCard;

  const onRate = (q: number) => {
    srsCard &&
      reviewSRSCard({
        id: srsCard.id,
        rating: q,
      });
  };

  const card = useMemo(
    () =>
      srsCard
        ? new IpsumSRSCard({
            creationDay: IpsumDay.fromString(
              srsCard.history.dateCreated,
              "iso"
            ),
            ratings: srsCard.reviews.map((review) => ({
              ...review,
              day: IpsumDay.fromString(review.day.day, "stored-day"),
              q: review.rating,
            })),
          })
        : null,
    [srsCard]
  );

  const ratedToday = card?.ratedOnDay(IpsumDay.today());

  const reviewState: HighlightBlurbConnectedProps["reviewState"] = (() => {
    if (!card) {
      return { type: "none" };
    } else if (ratedToday) {
      return { type: "reviewed", rating: card?.lastRating.q };
    } else if (card?.upForReview()) {
      return { type: "up_for_review" };
    } else {
      return { type: "not_up_for_review", nextReviewDay: card.nextReviewDay() };
    }
  })();

  return {
    highlightProps,
    relationsTableProps,
    relations,
    excerptProps,
    onHighlightClick,
    onHighlightObjectClick,
    onDelete,
    prospectiveIntervals: srsCard?.prospectiveIntervals,
    onRate,
    onStartSRS,
    reviewState,
    today: IpsumDay.today(),
  };
};
