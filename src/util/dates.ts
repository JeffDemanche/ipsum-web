/**
 * Util file for date/time-related hooks and helpers.
 */

import { DateTime } from "luxon";

/**
 * Gets current Luxon DateTime object.
 */
export const getCurrentLocalDateTime = (): DateTime => {
  return DateTime.now();
};

/**
 * Uses Luxon's default `toLocaleString`, which prints the day like "9/14/2017"
 */
export const getCurrentLocalDay = (): string => {
  return DateTime.now().toLocaleString();
};
