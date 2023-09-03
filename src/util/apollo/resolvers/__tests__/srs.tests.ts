import { gql } from "@apollo/client";
import { createHighlight } from "util/apollo/api/highlights";
import { createSRSCard } from "util/apollo/api/srs";
import { client, initializeState } from "util/apollo/client";
import { IpsumDay } from "util/dates";

jest.mock("../../autosave");

describe("SRS resolvers", () => {
  let todaySpy = jest.spyOn(IpsumDay, "today");

  beforeEach(() => {
    initializeState();
    todaySpy = jest.spyOn(IpsumDay, "today");
  });

  afterEach(async () => {
    todaySpy.mockRestore();
    await client.clearStore();
  });

  describe("srsCardsForReview", () => {
    it("should throw an error if the day is before today's date", () => {
      todaySpy.mockReturnValue(IpsumDay.fromString("1/4/2021"));

      expect(() =>
        client.readQuery({
          query: gql`
            query SRSCardsForToday($deckId: ID, $day: String!) {
              srsCardsForReview(deckId: $deckId, day: $day) {
                id
              }
            }
          `,
          variables: { deckId: "default", day: "1/2/2021" },
        })
      ).toThrowError("srsCardsForReview: Day must be today or later");
    });

    it("should return an empty array if there are no cards", () => {
      todaySpy.mockReturnValue(IpsumDay.fromString("1/1/2021"));

      const result = client.readQuery({
        query: gql`
          query SRSCardsForToday($deckId: ID, $day: String!) {
            srsCardsForReview(deckId: $deckId, day: $day) {
              id
            }
          }
        `,
        variables: { deckId: "default", day: "1/1/2021" },
      });

      expect(result.srsCardsForReview).toEqual([]);
    });

    it("should return cards from a prior day which are due today", () => {
      todaySpy.mockReturnValue(IpsumDay.fromString("1/1/2021"));

      const { id: highlightId } = createHighlight({ entry: "entry1" });

      const { id: card1Id } = createSRSCard({
        subjectId: highlightId,
        subjectType: "Highlight",
      });
      const { id: card2Id } = createSRSCard({
        subjectId: highlightId,
        subjectType: "Highlight",
      });

      const result1 = client.readQuery(
        {
          query: gql`
            query SRSCardsForToday($deckId: ID, $day: String!) {
              srsCardsForReview(deckId: $deckId, day: $day) {
                id
              }
            }
          `,
          variables: { deckId: "default", day: "1/2/2021" },
        },
        false
      );

      expect(result1.srsCardsForReview).toEqual([]);

      const result2 = client.readQuery(
        {
          query: gql`
            query SRSCardsForToday($deckId: ID, $day: String!) {
              srsCardsForReview(deckId: $deckId, day: $day) {
                id
              }
            }
          `,
          variables: { deckId: "default", day: "1/4/2021" },
        },
        false
      );

      expect(result2.srsCardsForReview).toEqual([
        { __typename: "SRSCard", id: card1Id },
        { __typename: "SRSCard", id: card2Id },
      ]);
    });
  });
});
