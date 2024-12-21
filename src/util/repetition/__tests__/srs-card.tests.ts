import { IpsumDay } from "util/dates";

import { IpsumSRSCard } from "../ipsum-srs-card";

describe("SRS Card", () => {
  test("should have base case EF and interval", () => {
    const card = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [],
    });
    expect(card.ease).toBe(2.5);
    expect(card.interval).toBe(1);
  });

  test("should become up for review the day after creation, but not on creation day", () => {
    const card = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [],
    });
    expect(
      card.upForReview(IpsumDay.fromString("1/1/2020", "entry-printed-date"))
    ).toBe(false);
    expect(
      card.upForReview(IpsumDay.fromString("1/2/2020", "entry-printed-date"))
    ).toBe(true);
  });

  test("upForReview should return correctly for non-today day", () => {
    const card = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [],
    });

    const rating1 = card.review(
      4,
      IpsumDay.fromString("1/2/2020", "entry-printed-date")
    );
    const card1 = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [rating1],
    });

    const rating2 = card1.review(
      4,
      IpsumDay.fromString("1/8/2020", "entry-printed-date")
    );
    const card2 = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [rating1, rating2],
    });

    const rating3 = card2.review(
      4,
      IpsumDay.fromString("1/18/2020", "entry-printed-date")
    );
    const card3 = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [rating1, rating2, rating3],
    });

    expect(card1.interval).toBe(4);
    expect(card2.interval).toBe(10);
    expect(card3.interval).toBe(25);

    [
      ["1/1/2020", false],
      ["1/2/2020", true],
      ["1/3/2020", false],
      ["1/6/2020", true],
      ["1/7/2020", true],
      ["1/8/2020", true],
      ["1/9/2020", false],
      ["1/17/2020", false],
      ["1/18/2020", true],
      ["1/19/2020", false],
    ].forEach(([day, expected]: [string, boolean]) => {
      expect(
        card3.upForReview(IpsumDay.fromString(day, "entry-printed-date"))
      ).toBe(expected);
    });
  });

  test("should have variable EF and constant interval after single 5 rating", () => {
    const card = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [],
    });
    const rating = card.review(
      5,
      IpsumDay.fromString("1/2/2020", "entry-printed-date")
    );
    expect(rating.easeAfter).toBe(2.6);
    expect(rating.intervalAfter).toBe(5);
  });

  test("should have variable EF and constant interval after single 4 rating", () => {
    const card = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [],
    });
    const rating = card.review(
      4,
      IpsumDay.fromString("1/2/2020", "entry-printed-date")
    );
    expect(rating.easeAfter).toBe(2.5);
    expect(rating.intervalAfter).toBe(4);
  });

  test.each<{
    ratings: number[];
    intervalsAfter?: number[];
    easesAfter?: number[];
  }>([
    { ratings: [0, 0, 0], intervalsAfter: [1, 1.3, 1.69] },
    { ratings: [1, 1, 1], intervalsAfter: [1, 1.42, 1.846] },
    { ratings: [2, 2, 2], intervalsAfter: [2, 3.72, 5.728] },
    { ratings: [3, 3, 3], intervalsAfter: [3, 6.66, 13.853] },
    { ratings: [4, 4, 4], intervalsAfter: [4, 10, 25] },
    { ratings: [5, 5, 5], intervalsAfter: [5, 13.5, 37.8] },
    {
      ratings: [3, 3, 3, 0],
      intervalsAfter: [3, 6.66, 13.853, 18.009],
      easesAfter: [2.36, 2.22, 2.08, 1.3],
    },
  ])(
    "should have correct intervals and eases after ratings: $ratings",
    ({ ratings, intervalsAfter, easesAfter }) => {
      let nextCard = new IpsumSRSCard({
        creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
        ratings: [],
      });
      let nextReviewDay = IpsumDay.fromString("1/2/2020", "entry-printed-date");
      const reviewsAfter = ratings.map((rating, i) => {
        const review = nextCard.review(rating, nextReviewDay);
        nextCard = new IpsumSRSCard({
          creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
          ratings: [...nextCard.cardHistory.ratings, review],
        });
        nextReviewDay = nextReviewDay.add(Math.ceil(review.intervalAfter));
        return review;
      });
      reviewsAfter.forEach(({ intervalAfter, easeAfter }, i) => {
        if (intervalsAfter) {
          expect(intervalAfter).toBeCloseTo(intervalsAfter[i]);
        }
        if (easesAfter) {
          expect(easeAfter).toBeCloseTo(easesAfter[i]);
        }
      });
    }
  );

  test.each<{
    priorEase: number;
    priorInterval: number;
    q: number;
    expectedEase: number;
    expectedInterval: number;
  }>([
    {
      q: 0,
      priorEase: 2.5,
      priorInterval: 1,
      expectedEase: 1.7,
      expectedInterval: 1.7,
    },
    {
      q: 0,
      priorEase: 1.7,
      priorInterval: 1.7,
      expectedEase: 1.3,
      expectedInterval: 2.21,
    },
    {
      q: 0,
      priorEase: 1.3,
      priorInterval: 2.21,
      expectedEase: 1.3,
      expectedInterval: 2.873,
    },
    {
      q: 5,
      priorEase: 2.5,
      priorInterval: 1,
      expectedEase: 2.6,
      expectedInterval: 2.6,
    },
    {
      q: 5,
      priorEase: 2.6,
      priorInterval: 2.6,
      expectedEase: 2.7,
      expectedInterval: 7.02,
    },
    {
      q: 5,
      priorEase: 2.7,
      priorInterval: 7.02,
      expectedEase: 2.8,
      expectedInterval: 19.656,
    },
  ])(
    "for prior ease $priorEase and interval $priorInterval, should have ease $expectedEase and interval $expectedInterval after rating $q",
    ({ q, priorEase, priorInterval, expectedEase, expectedInterval }) => {
      const card = new IpsumSRSCard({
        creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
        ratings: [
          {
            day: IpsumDay.fromString("1/2/2020", "entry-printed-date"),
            q: 4,
            easeBefore: 2.5,
            easeAfter: priorEase,
            intervalBefore: 1,
            intervalAfter: priorInterval,
          },
        ],
      });
      const rating = card.review(
        q,
        IpsumDay.fromString("1/31/2020", "entry-printed-date")
      );
      expect(rating.easeAfter).toBeCloseTo(expectedEase);
      expect(rating.intervalAfter).toBeCloseTo(expectedInterval);
    }
  );
});
