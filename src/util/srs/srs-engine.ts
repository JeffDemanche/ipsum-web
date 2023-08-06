/**
 * Based on SM2 algorithm. This is run after a SRS card has been reviewed to
 * update the card's interval and EF.
 *
 * @param previousInterval The previous interval of the SRS card.
 * @param previousEF The previous EF of the SRS card.
 * @param rating The rating the user gave the card.
 */
export const calculateNextInterval = (
  previousInterval: number,
  previousEF: number,
  rating: number
) => {
  const nextEF =
    previousEF + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));

  return { nextInterval: previousInterval * nextEF, nextEF };
};
