import {
  apiCreateComment,
  apiCreateHighlight,
  apiCreateJournalEntry,
} from "util/api/project-actions";
import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state/project";

import { processEntrySections } from "./mock-utils";
import { GeneratedMock, MockedComment, MockedEntry } from "./types";

interface GenerateMockProps {
  /**
   * Array of string "sections" that will be added to htmlString. Also all
   * highlights on journal entries are defined in here.
   */
  journalEntries?: MockedEntry[];
  comments?: MockedComment[];
}

export const generateMock = (props: GenerateMockProps): GeneratedMock => {
  const projectState = new ProjectState();

  props.journalEntries?.forEach((journalEntry) => {
    const { htmlString, highlights } = processEntrySections(journalEntry);

    apiCreateJournalEntry(
      {
        dayCreated: IpsumDay.fromString(journalEntry.entryKey, "stored-day"),
        entryKey: journalEntry.entryKey,
        htmlString,
      },
      { projectState }
    );

    highlights?.forEach((highlight) => {
      apiCreateHighlight(
        {
          id: highlight.id,
          entryKey: highlight.entryKey,
        },
        { projectState }
      );

      highlight.comments.forEach((comment) => {
        apiCreateComment(
          {
            id: comment.id,
            highlight: comment.highlightId,
            htmlString: processEntrySections(comment.mockedEntry).htmlString,
            dayCreated: comment.dayCreated,
          },
          { projectState }
        );
      });
    });
  });

  return { projectState };
};
