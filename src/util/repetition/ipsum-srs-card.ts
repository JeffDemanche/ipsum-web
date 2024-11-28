import { IpsumDay } from "util/dates";
import { InMemorySRSCard } from "util/state";

import { SRSCardHistory, SRSCardRating } from "./types";

const EASE_BEFORE_FIRST_REVIEW = 2.5;

const INTERVAL_BEFORE_FIRST_REVIEW = 1;

// https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
// This is the interval set between the first and second review.
const INITIAL_REP_INTERVALS = [1, 1, 2, 3, 4, 5];

export class IpsumSRSCard {
  private __cardHistory: Readonly<SRSCardHistory>;
  private __lastRating?: Readonly<SRSCardRating>;

  private __ease: number;
  private __interval: number;

  constructor(cardHistory: SRSCardHistory) {
    this.__cardHistory = cardHistory;

    const numRatings = this.__cardHistory.ratings.length;

    if (numRatings === 0) {
      this.__ease = EASE_BEFORE_FIRST_REVIEW;
      this.__interval = INTERVAL_BEFORE_FIRST_REVIEW;
    } else {
      this.__lastRating = this.__cardHistory.ratings.reduce((a, b) =>
        a.day.isAfter(b.day) ? a : b
      );
      this.__ease = this.__lastRating.easeAfter;
      this.__interval = this.__lastRating.intervalAfter;
    }
  }

  get cardHistory(): SRSCardHistory {
    return this.__cardHistory;
  }

  ratedOnDay(day: IpsumDay): boolean {
    return this.__cardHistory.ratings.some((rating) => rating.day.equals(day));
  }

  get ease(): number {
    return this.__ease;
  }

  lastRatingBeforeDay(day: IpsumDay): SRSCardRating {
    if (this.__cardHistory.ratings.length === 0) return undefined;

    return this.__cardHistory.ratings.reduce((prev, cur) =>
      cur.day.isAfter(prev.day) && cur.day.isBefore(day) ? cur : prev
    );
  }

  easeOnDay(day: IpsumDay): number {
    return this.lastRatingBeforeDay(day)?.easeAfter ?? EASE_BEFORE_FIRST_REVIEW;
  }

  get interval(): number {
    return this.__interval;
  }

  /**
   * Note that this is not the same as the number of days until the next review.
   * It is the interval in days that was set after the last review.
   */
  intervalOnDay(day: IpsumDay): number {
    return (
      this.lastRatingBeforeDay(day)?.intervalAfter ??
      INTERVAL_BEFORE_FIRST_REVIEW
    );
  }

  easeAfterRating(q: number): number {
    if (q < 0 || q > 5) {
      throw new Error("Rating must be between 0 and 5");
    }

    return Math.max(
      1.3,
      this.__ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    );
  }

  intervalAfterRating(q: number): number {
    if (q < 0 || q > 5) {
      throw new Error("Rating must be between 0 and 5");
    }

    // The first rating
    if (this.__cardHistory.ratings.length === 0) {
      return INITIAL_REP_INTERVALS[Math.round(q)];
    }

    if (this.__lastRating) {
      return this.__interval * this.easeAfterRating(q);
    }

    return this.__interval;
  }

  /**
   * If the card was reviewed on the given day, it is considered up for review by convention.
   */
  upForReview(day?: IpsumDay): boolean {
    day = day ?? IpsumDay.today();

    if (this.__cardHistory.ratings.some((rating) => rating.day.equals(day))) {
      return true;
    }

    const lastReviewDay =
      this.lastRatingBeforeDay(day)?.day ?? this.__cardHistory.creationDay;

    const nextReviewDay = lastReviewDay.add(Math.ceil(this.intervalOnDay(day)));

    return nextReviewDay.isBefore(day) || nextReviewDay.equals(day);
  }

  nextReviewDay(): IpsumDay {
    return this.__lastRating
      ? this.__lastRating.day.add(Math.ceil(this.__interval))
      : this.__cardHistory.creationDay.add(this.__interval);
  }

  get lastRating() {
    return this.__lastRating;
  }

  /**
   * Does not mutate the card instance.
   */
  review(q: number, today?: IpsumDay): SRSCardRating {
    if (!this.upForReview(today)) {
      return undefined;
    }

    today = today ?? IpsumDay.today();

    const rating: SRSCardRating = {
      day: today,
      q,
      easeBefore: this.__ease,
      easeAfter: this.easeAfterRating(q),
      intervalBefore: this.__interval,
      intervalAfter: this.intervalAfterRating(q),
    };

    return rating;
  }

  static fromProjectStateCard(card: InMemorySRSCard) {
    return new IpsumSRSCard({
      creationDay: IpsumDay.fromString(card.history.dateCreated, "iso"),
      ratings: card.reviews.map((review) => ({
        ...review,
        q: review.rating,
        day: IpsumDay.fromString(review.day, "stored-day"),
      })),
    });
  }

  static fromRatings({
    creationDay,
    ratings,
  }: {
    creationDay: IpsumDay;
    ratings: { day: IpsumDay; rating: number }[];
  }) {
    return ratings.reduce(
      (acc, cur) => {
        const rating = acc.review(cur.rating, cur.day);
        const accRatings = acc.__cardHistory.ratings;
        return new IpsumSRSCard({
          creationDay,
          ratings: rating ? [...accRatings, rating] : accRatings,
        });
      },
      new IpsumSRSCard({ creationDay, ratings: [] })
    );
  }
}
