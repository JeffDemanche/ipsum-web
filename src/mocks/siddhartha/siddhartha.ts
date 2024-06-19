import { paragraphArrayToHtmlString } from "mocks/mock-utils";
import { createJournalEntry, EntryType } from "util/apollo";

import { chapter1 as chapter1Text, chapter2 as chapter2Text } from "./corpus";

export const mockSiddhartha = () => {
  createJournalEntry({
    entryKey: "1/1/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter1Text),
  });

  createJournalEntry({
    entryKey: "1/8/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter2Text),
  });

  console.log("here");
};
