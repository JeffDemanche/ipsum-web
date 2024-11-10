import { IpsumDay } from "util/dates";

import { IpsumSRSCard } from "../srs-card";

describe("SRS Card", () => {
  it("should have base case EF and interval", () => {
    const card = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [],
    });
    expect(card.ease).toBe(2.5);
    expect(card.interval).toBe(1);
  });

  it("should become up for review the day after creation, but not on creation day", () => {
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

  it("should have variable EF and constant interval after single 5 rating", () => {
    const card = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [],
    });
    const rating = card.review(
      5,
      IpsumDay.fromString("1/2/2020", "entry-printed-date")
    );
    expect(rating.easeAfter).toBe(2.6);
    expect(rating.intervalAfter).toBe(6);
  });

  it("should have variable EF and constant interval after single 4 rating", () => {
    const card = new IpsumSRSCard({
      creationDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
      ratings: [],
    });
    const rating = card.review(
      4,
      IpsumDay.fromString("1/2/2020", "entry-printed-date")
    );
    expect(rating.easeAfter).toBe(2.5);
    expect(rating.intervalAfter).toBe(6);
  });

  it.each<{
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
