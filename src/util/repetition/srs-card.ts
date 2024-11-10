import { SrsCard } from "util/apollo";
import { IpsumDay } from "util/dates";
import { InMemorySRSCard } from "util/state";

import { SRSCardHistory, SRSCardRating } from "./types";

// https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
const INITIAL_REP_INTERVAL = 6;

export class IpsumSRSCard {
  private __cardHistory: Readonly<SRSCardHistory>;
  private __lastRating?: Readonly<SRSCardRating>;

  private __ease: number;
  private __interval: number;

  constructor(cardHistory: SRSCardHistory) {
    this.__cardHistory = cardHistory;

    const numRatings = this.__cardHistory.ratings.length;

    if (numRatings === 0) {
      this.__ease = 2.5;
      this.__interval = 1;
    } else {
      this.__lastRating = this.__cardHistory.ratings.reduce((a, b) =>
        a.day.isAfter(b.day) ? a : b
      );
      this.__ease = this.__lastRating.easeAfter;
      this.__interval = this.__lastRating.intervalAfter;
    }
  }

  ratedOnDay(day: IpsumDay): boolean {
    return this.__cardHistory.ratings.some((rating) => rating.day.equals(day));
  }

  get ease(): number {
    return this.__ease;
  }

  get interval(): number {
    return this.__interval;
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
      return INITIAL_REP_INTERVAL;
    }

    if (this.__lastRating) {
      return this.__interval * this.easeAfterRating(q);
    }

    return this.__interval;
  }

  upForReview(today?: IpsumDay): boolean {
    today = today ?? IpsumDay.today();

    const firstReviewDay = this.__lastRating
      ? this.__lastRating.day.add(Math.ceil(this.__interval))
      : this.__cardHistory.creationDay.add(this.__interval);

    return firstReviewDay.isBefore(today) || firstReviewDay.equals(today);
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
      throw new Error("Card is not up for review");
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
}
