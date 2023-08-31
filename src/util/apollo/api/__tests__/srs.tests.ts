import { initializeState, vars } from "util/apollo/client";
import { IpsumDay } from "util/dates";
import { createHighlight } from "../highlights";
import { createSRSCard, deleteSRSCard, reviewSRSCard } from "../srs";

jest.mock("../../autosave");

describe("apollo srs API", () => {
  beforeEach(() => {
    initializeState();
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
      const { reviews } = reviewSRSCard({
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
