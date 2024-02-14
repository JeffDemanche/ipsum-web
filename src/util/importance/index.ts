import { IpsumDay } from "util/dates";

const IMPORTANCE_HALF_LIFE = 7;

/**
 * Sum the importance of ratings on a given day. The importance of a rating is
 * given by the exponential decay function `rating * 2 ^ (-daysSinceRating /
 * halfLife)`.
 */
export const highlightImportanceOnDay = ({
  ratings,
  day,
  halfLife = IMPORTANCE_HALF_LIFE,
}: {
  ratings: readonly { day: string; value: number }[];
  day?: IpsumDay;
  halfLife?: number;
}) => {
  day = day ?? IpsumDay.today();

  if (ratings.length === 0) {
    return 0;
  }

  return ratings.reduce((acc, cur) => {
    const ratingDay = IpsumDay.fromString(cur.day, "stored-day");

    if (day.isBefore(ratingDay)) {
      return acc;
    }

    const numDaysSinceRating = ratingDay.numDaysUntil(day);

    return acc + Math.pow(cur.value * 2, -numDaysSinceRating / halfLife);
  }, 0);
};
