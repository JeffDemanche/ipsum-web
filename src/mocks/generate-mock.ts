import {
  apiCreateArc,
  apiCreateComment,
  apiCreateHighlight,
  apiCreateJournalEntry,
  apiCreateRelationFromHighlightToArc,
} from "util/api/project-actions";
import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state/project";

import { processEntrySections } from "./mock-utils";
import {
  GeneratedMock,
  MockedArc,
  MockedComment,
  MockedHighlight,
  MockedJournalEntry,
} from "./types";

interface GenerateMockProps {
  /**
   * Array of string "sections" that will be added to htmlString. Also all
   * highlights on journal entries are defined in here.
   */
  journalEntries?: MockedJournalEntry[];
  arcs?: MockedArc[];
  comments?: MockedComment[];
}

export const generateMock = (props: GenerateMockProps): GeneratedMock => {
  const projectState = new ProjectState();

  // Called to create hightlights for both journal and arc entries.
  const createMockHighlights = (mockedHighlights: MockedHighlight[]) => {
    mockedHighlights.forEach((highlight) => {
      apiCreateHighlight(
        {
          id: highlight.id,
          entryKey: highlight.entryKey,
          dayCreated: highlight.dayCreated,
        },
        { projectState }
      );

      highlight.outgoingRelations?.forEach((relation) => {
        apiCreateRelationFromHighlightToArc(
          {
            id: relation.id,
            arcId: relation.arcId,
            highlightId: highlight.id,
            predicate: relation.predicate,
          },
          { projectState }
        );
      });

      highlight.comments?.forEach((comment) => {
        apiCreateComment(
          {
            id: comment.id,
            highlight: highlight.id,
            htmlString: processEntrySections(comment.mockedEntry).htmlString,
            dayCreated: comment.dayCreated,
          },
          { projectState }
        );
      });
    });
  };

  // Create arcs
  props.arcs?.forEach((arc) => {
    const { htmlString } = processEntrySections(arc.arcEntry);

    apiCreateArc(
      {
        id: arc.id,
        name: arc.name,
        entryHtmlString: htmlString,
        hue: arc.hue,
      },
      { projectState }
    );
  });

  // Create highlights on arcs
  props.arcs?.forEach((arc) => {
    const { highlights } = processEntrySections(arc.arcEntry);

    createMockHighlights(highlights);
  });

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

    createMockHighlights(highlights);
  });

  return { projectState };
};
