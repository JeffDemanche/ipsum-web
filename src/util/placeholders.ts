import type { IpsumDateTime } from "./dates";

export const placeholders = ["Who asks the question? Who answers?"];

export const placeholderForDate = (date: IpsumDateTime) => {
  return placeholders[
    Math.floor(date.dateTime.toSeconds() / 60 / 60 / 24) % placeholders.length
  ];
};
