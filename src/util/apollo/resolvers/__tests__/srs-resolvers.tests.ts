import { gql } from "@apollo/client";
import { createHighlight } from "util/apollo/api/highlights";
import { createSRSCard, reviewSRSCard } from "util/apollo/api/srs";
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

  describe("srsReviewsFromDay", () => {
    it("should throw an error if the day is after today's date", () => {
      todaySpy.mockReturnValue(IpsumDay.fromString("1/1/2021"));

      expect(() =>
        client.readQuery({
          query: gql`
            query SRSReviewsFromDay($day: String!) {
              srsReviewsFromDay(day: $day) {
                id
              }
            }
          `,
          variables: { day: "1/31/2022" },
        })
      ).toThrowError("srsReviewsFromDay: Day must be today or earlier");
    });

    it("should return an empty array if there are no reviews from day", () => {
      const result = client.readQuery({
        query: gql`
          query SRSReviewsFromDay($day: String!) {
            srsReviewsFromDay(day: $day) {
              id
            }
          }
        `,
        variables: { day: "1/1/2021" },
      });

      expect(result.srsReviewsFromDay).toEqual([]);
    });

    it("should return reviews from a prior day", () => {
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

      const {
        srsCardReview: { id: card1ReviewDay1 },
      } = reviewSRSCard({
        cardId: card1Id,
        rating: 3,
      });

      const result = client.readQuery({
        query: gql`
          query SRSReviewsFromDay($day: String!) {
            srsReviewsFromDay(day: $day) {
              id
              rating
            }
          }
        `,
        variables: { day: "1/1/2021" },
      });

      expect(result.srsReviewsFromDay).toEqual([
        { __typename: "SRSCardReview", id: card1ReviewDay1, rating: 3 },
      ]);

      todaySpy.mockReturnValue(IpsumDay.fromString("1/2/2021"));

      const {
        srsCardReview: { id: card1ReviewDay2 },
      } = reviewSRSCard({
        cardId: card1Id,
        rating: 1,
      });
      const {
        srsCardReview: { id: card2ReviewDay2 },
      } = reviewSRSCard({
        cardId: card2Id,
        rating: 2,
      });

      const result2 = client.readQuery({
        query: gql`
          query SRSReviewsFromDay($day: String!) {
            srsReviewsFromDay(day: $day) {
              id
              rating
            }
          }
        `,
        variables: { day: "1/2/2021" },
      });

      expect(result2.srsReviewsFromDay).toEqual([
        { __typename: "SRSCardReview", id: card1ReviewDay2, rating: 1 },
        { __typename: "SRSCardReview", id: card2ReviewDay2, rating: 2 },
      ]);
    });
  });
});
