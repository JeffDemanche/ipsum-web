import { initializeState, vars } from "util/apollo/client";
import { IpsumDateTime, IpsumDay } from "util/dates";
import { createHighlight } from "../highlights";
import { createSRSCard, deleteSRSCard, reviewSRSCard } from "../srs";

jest.mock("../../autosave");

describe("apollo srs API", () => {
  let todaySpy = jest.spyOn(IpsumDay, "today");

  beforeEach(() => {
    initializeState();
    todaySpy = jest.spyOn(IpsumDay, "today");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createSRSCard", () => {
    it("should create a card with default values and no reviews", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });

      const { id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      expect(vars.srsCards()[id].deck).toEqual("default");
      expect(vars.srsCards()[id].ef).toEqual(2.5);
      expect(vars.srsCards()[id].interval).toEqual(1);
      expect(vars.srsCards()[id].reviews).toEqual([]);
      expect(vars.srsCards()[id].subject).toEqual(highlightId);
      expect(vars.srsCards()[id].subjectType).toEqual("Highlight");
      expect(vars.srsCards()[id].id).toEqual(id);
      expect(vars.srsCards()[id].endDate).not.toBeDefined();
      expect(vars.srsCards()[id].history.dateCreated).toEqual(
        IpsumDateTime.today().toString("iso")
      );
    });

    it("should throw an error if the subject does not exist", () => {
      expect(() =>
        createSRSCard({
          subjectType: "Highlight",
          subjectId: "highlight 1",
        })
      ).toThrowError("createSRSCard: Subject highlight not found");

      expect(() =>
        createSRSCard({
          subjectType: "Arc",
          subjectId: "arc 1",
        })
      ).toThrowError("createSRSCard: Subject arc not found");
    });
  });

  describe("reviewSRSCard", () => {
    it("should throw an error if the card does not exist", () => {
      expect(() =>
        createSRSCard({
          subjectType: "Highlight",
          subjectId: "highlight 1",
        })
      ).toThrowError("createSRSCard: Subject highlight not found");
    });

    it("should throw an error if the rating is not between 0 and 5", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      expect(() =>
        reviewSRSCard({
          cardId: id,
          rating: -1,
        })
      ).toThrowError("reviewSRSCard: Rating must be between 0 and 5");
      expect(() =>
        reviewSRSCard({
          cardId: id,
          rating: 6,
        })
      ).toThrowError("reviewSRSCard: Rating must be between 0 and 5");
    });

    it("should update the card's interval and EF upward after a rating of 5", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      reviewSRSCard({
        cardId: id,
        rating: 5,
      });
      expect(vars.srsCards()[id].interval).toEqual(2.6);
      expect(vars.srsCards()[id].ef).toEqual(2.6);
    });

    it("should update the card's interval and EF downward after a rating of 0", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      reviewSRSCard({
        cardId: id,
        rating: 0,
      });
      expect(vars.srsCards()[id].interval).toBeCloseTo(1.7);
      expect(vars.srsCards()[id].ef).toBeCloseTo(1.7);
    });

    it("should add new SRSCardReview object with correct fields", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      const {
        srsCard: { reviews },
      } = reviewSRSCard({
        cardId: id,
        rating: 0,
      });
      expect(vars.srsCards()[id].reviews.length).toEqual(1);
      expect(reviews[0]).toBeDefined();
      expect(vars.srsCardReviews()[reviews[0]].beforeEF).toEqual(2.5);
      expect(vars.srsCardReviews()[reviews[0]].afterEF).toBeCloseTo(1.7);
      expect(vars.srsCardReviews()[reviews[0]].day).toEqual(
        IpsumDay.today().toString()
      );
    });

    it("should create or update a day object for the day of the review", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id: card1Id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      const { id: card2Id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      const dateKey = IpsumDay.today().toString();

      expect(vars.days()[dateKey]).not.toBeDefined();
      const {
        srsCardReview: { id: review1Id },
      } = reviewSRSCard({
        cardId: card1Id,
        rating: 0,
      });
      expect(vars.days()[dateKey]).toBeDefined();
      expect(vars.days()[dateKey].srsCardReviews.length).toEqual(1);
      const {
        srsCardReview: { id: review2Id },
      } = reviewSRSCard({
        cardId: card2Id,
        rating: 4,
      });
      expect(vars.days()[dateKey].srsCardReviews.length).toEqual(2);
      expect(vars.days()[dateKey].srsCardReviews).toEqual([
        review1Id,
        review2Id,
      ]);
    });

    it("should update ef, interval, and rating after rereviewing a card on the same day", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id: cardId } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      const dateKey = IpsumDay.today().toString();

      const {
        srsCardReview: { id: review1Id },
      } = reviewSRSCard({
        cardId,
        rating: 1,
      });

      expect(vars.days()[dateKey].srsCardReviews.length).toEqual(1);
      expect(vars.srsCardReviews()[review1Id].beforeEF).toEqual(2.5);
      expect(vars.srsCardReviews()[review1Id].afterEF).toEqual(1.96);
      expect(vars.srsCardReviews()[review1Id].rating).toEqual(1);
      expect(vars.srsCards()[cardId].ef).toEqual(1.96);
      expect(vars.srsCards()[cardId].interval).toEqual(1.96);

      const {
        srsCardReview: { id: review2Id },
      } = reviewSRSCard({
        cardId,
        rating: 3,
      });

      expect(vars.days()[dateKey].srsCardReviews.length).toEqual(1);
      expect(vars.srsCardReviews()[review2Id].beforeEF).toEqual(2.5);
      expect(vars.srsCardReviews()[review2Id].afterEF).toEqual(2.36);
      expect(vars.srsCardReviews()[review2Id].rating).toEqual(3);
      expect(vars.srsCards()[cardId].ef).toEqual(2.36);
      expect(vars.srsCards()[cardId].interval).toEqual(2.36);
    });

    it("should not duplicate a rereview on the same day", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      const dateKey = IpsumDay.today().toString();

      expect(vars.days()[dateKey]).not.toBeDefined();
      reviewSRSCard({
        cardId: id,
        rating: 0,
      });
      expect(vars.days()[dateKey]).toBeDefined();
      expect(vars.days()[dateKey].srsCardReviews.length).toEqual(1);
      const {
        srsCardReview: { id: review2Id },
      } = reviewSRSCard({
        cardId: id,
        rating: 4,
      });
      expect(vars.days()[dateKey].srsCardReviews.length).toEqual(1);
      expect(vars.days()[dateKey].srsCardReviews).toEqual([review2Id]);
    });

    it("should add multiple reviews for cards reviewed on multiple days", () => {
      todaySpy.mockReturnValueOnce(IpsumDay.fromString("2021-01-01"));

      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id: cardId } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });

      expect(vars.srsCards()[cardId].reviews.length).toEqual(0);
      expect(Object.values(vars.srsCardReviews()).length).toEqual(0);
      expect(vars.srsCards()[cardId].ef).toEqual(2.5);
      expect(vars.srsCards()[cardId].interval).toEqual(1);

      reviewSRSCard({
        cardId,
        rating: 0,
      });

      expect(vars.srsCards()[cardId].reviews.length).toEqual(1);
      expect(Object.values(vars.srsCardReviews()).length).toEqual(1);
      expect(vars.srsCards()[cardId].ef).toBeCloseTo(1.7);
      expect(vars.srsCards()[cardId].interval).toBeCloseTo(1.7);

      todaySpy.mockReturnValueOnce(IpsumDay.fromString("2021-01-02"));

      reviewSRSCard({
        cardId,
        rating: 0,
      });

      expect(vars.srsCards()[cardId].reviews.length).toEqual(2);
      expect(Object.values(vars.srsCardReviews()).length).toEqual(2);
      expect(vars.srsCards()[cardId].ef).toBeCloseTo(0.9);
      expect(vars.srsCards()[cardId].interval).toBeCloseTo(1.53);

      todaySpy.mockReturnValueOnce(IpsumDay.fromString("2021-01-03"));

      reviewSRSCard({
        cardId,
        rating: 5,
      });

      expect(vars.srsCards()[cardId].reviews.length).toEqual(3);
      expect(Object.values(vars.srsCardReviews()).length).toEqual(3);
      expect(vars.srsCards()[cardId].ef).toBeCloseTo(1);
      expect(vars.srsCards()[cardId].interval).toBeCloseTo(1.53);

      todaySpy.mockReturnValueOnce(IpsumDay.fromString("2021-01-04"));

      reviewSRSCard({
        cardId,
        rating: 5,
      });

      expect(vars.srsCards()[cardId].reviews.length).toEqual(4);
      expect(Object.values(vars.srsCardReviews()).length).toEqual(4);
      expect(vars.srsCards()[cardId].ef).toBeCloseTo(1.1);
      expect(vars.srsCards()[cardId].interval).toBeCloseTo(1.68);
    });
  });

  describe("deleteSRSCard", () => {
    it("should delete the card", () => {
      const { id: highlightId } = createHighlight({
        entry: "entry",
      });
      const { id } = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlightId,
      });
      expect(vars.srsCards()[id]).toBeDefined();
      deleteSRSCard({ cardId: id });
      expect(vars.srsCards()[id]).not.toBeDefined();
    });
  });
});
