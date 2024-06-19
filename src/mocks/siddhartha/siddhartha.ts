import { paragraphArrayToHtmlString } from "mocks/mock-utils";
import { createJournalEntry, EntryType } from "util/apollo";

import {
  chapter1TheSonOfTheBrahman,
  chapter2WithTheSamanas,
  chapter3Gotama,
  chapter4Awakening,
  chapter5Kamala,
  chapter6WithTheChildlikePeople,
  chapter7Sansara,
  chapter8ByTheRiver,
  chapter9TheFerryman,
  chapter10TheSon,
  chapter11Om,
  chapter12Govinda,
} from "./corpus";

export const mockSiddhartha = () => {
  // Create journal entries
  createJournalEntry({
    entryKey: "1/1/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter1TheSonOfTheBrahman),
  });

  createJournalEntry({
    entryKey: "1/8/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter2WithTheSamanas),
  });

  createJournalEntry({
    entryKey: "1/15/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter3Gotama),
  });

  createJournalEntry({
    entryKey: "1/22/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter4Awakening),
  });

  createJournalEntry({
    entryKey: "1/29/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter5Kamala),
  });

  createJournalEntry({
    entryKey: "2/5/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter6WithTheChildlikePeople),
  });

  createJournalEntry({
    entryKey: "2/12/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter7Sansara),
  });

  createJournalEntry({
    entryKey: "2/19/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter8ByTheRiver),
  });

  createJournalEntry({
    entryKey: "2/26/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter9TheFerryman),
  });

  createJournalEntry({
    entryKey: "3/4/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter10TheSon),
  });

  createJournalEntry({
    entryKey: "3/11/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter11Om),
  });

  createJournalEntry({
    entryKey: "3/18/2020",
    entryType: EntryType.Journal,
    htmlString: paragraphArrayToHtmlString(chapter12Govinda),
  });
};
