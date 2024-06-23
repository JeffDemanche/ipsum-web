import {
  createComment,
  createHighlight,
  createJournalEntry,
  EntryType,
} from "util/apollo";
import { upsertDay } from "util/apollo/api/day";
import { IpsumDay } from "util/dates";

import { processEntrySections } from "./mock-utils";
import { MockedComment, MockedEntry } from "./types";

interface GenerateMockProps {
  /**
   * Array of string "sections" that will be added to htmlString. Also all
   * highlights on journal entries are defined in here.
   */
  journalEntries?: MockedEntry[];
  comments?: MockedComment[];
}

export const generateMock = (props: GenerateMockProps): void => {
  props.journalEntries?.forEach((journalEntry) => {
    const { htmlString, highlights } = processEntrySections(journalEntry);

    createJournalEntry({
      dayCreated: IpsumDay.fromString(journalEntry.entryKey, "stored-day"),
      entryKey: journalEntry.entryKey,
      entryType: EntryType.Journal,
      htmlString,
    });

    highlights?.forEach((highlight) => {
      createHighlight({
        id: highlight.id,
        entry: highlight.entryKey,
      });

      highlight.comments.forEach((comment) => {
        createComment({
          id: comment.id,
          highlight: comment.highlightId,
          htmlString: processEntrySections(comment.mockedEntry).htmlString,
          dayCreated: comment.dayCreated,
        });
      });
    });
  });
};
