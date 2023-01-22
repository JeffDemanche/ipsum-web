import { IpsumDateTime } from "./dates";

export const placeholders = [
  "Tell a story to your future...",
  "What do you wish you knew about yourself?",
  "Know thyself...",
  "Send yourself a message...",
  "What do you need yourself to say?",
  "Where do you go from here?",
];

export const placeholderForDate = (date: IpsumDateTime) => {
  return placeholders[
    Math.floor(date.dateTime.toSeconds() / 60 / 60 / 24) % placeholders.length
  ];
};
