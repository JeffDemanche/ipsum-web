import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state";

import {
  apiCreateEntry,
  apiCreateHighlight,
  apiCreateSRSCard,
  apiReviewSRSCard,
} from "..";

describe("API srs actions", () => {
  describe("createSrsCard", () => {
    it("should create an srs card and update highlight with its ID", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      apiCreateEntry(
        {
          entryKey: "entry-key",
          dayCreated,
          htmlString: "<div>hello world</div>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );

      const highlight = apiCreateHighlight(
        { id: "highlight id", entryKey: "entry-key", dayCreated },
        { projectState: state }
      );

      apiCreateSRSCard(
        {
          id: "card id",
          subjectType: "Highlight",
          subject: highlight.id,
          dayCreated,
        },
        { projectState: state }
      );

      expect(
        state.collection("highlights").get("highlight id").srsCard
      ).toEqual("card id");
      expect(state.collection("srsCards").get("card id")).toEqual({
        __typename: "SRSCard",
        id: "card id",
        history: {
          __typename: "History",
          dateCreated: dayCreated.toString("iso"),
        },
        reviews: [],
        subject: "highlight id",
        subjectType: "Highlight",
      });
    });
  });

  describe("reviewSrsCard", () => {
    it("should add a review to an srs card and update the day object", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");
      const dayReviewed1 = IpsumDay.fromString("1/8/2020", "stored-day");
      const dayReviewed2 = IpsumDay.fromString("1/13/2020", "stored-day");

      apiCreateEntry(
        {
          entryKey: "entry-key",
          dayCreated,
          htmlString: "<div>hello world</div>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );

      const highlight = apiCreateHighlight(
        { entryKey: "entry-key", dayCreated },
        { projectState: state }
      );

      const srsCard = apiCreateSRSCard(
        {
          subjectType: "Highlight",
          subject: highlight.id,
          dayCreated,
        },
        { projectState: state }
      );

      apiReviewSRSCard(
        {
          id: srsCard.id,
          day: dayReviewed1,
          rating: 5,
        },
        { projectState: state }
      );

      const reviewedSrsCard2 = apiReviewSRSCard(
        {
          id: srsCard.id,
          day: dayReviewed2,
          rating: 3,
        },
        { projectState: state }
      );

      const day1 = state
        .collection("days")
        .get(dayReviewed1.toString("entry-printed-date"));

      const day2 = state
        .collection("days")
        .get(dayReviewed2.toString("entry-printed-date"));

      expect(reviewedSrsCard2.reviews).toEqual([
        {
          __typename: "SRSCardReview",
          day: dayReviewed1.toString("stored-day"),
          rating: 5,
        },
        {
          __typename: "SRSCardReview",
          day: dayReviewed2.toString("stored-day"),
          rating: 3,
        },
      ]);
      expect(day1.srsCardsReviewed).toEqual([srsCard.id]);
      expect(day2.srsCardsReviewed).toEqual([srsCard.id]);
    });
  });
});
