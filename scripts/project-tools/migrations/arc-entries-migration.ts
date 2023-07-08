// 1. Reassign all contentState to a stringified IpsumTimeMachine value and
//    rename the field to trackedContentState
// 2. Create an entry for each Arc with the correct entryKey.
// 3. Create an ArcEntry object for each arc.
// 4. Assign the arcEntry field of each Arc to the correct ArcEntry, and the
//    entry field of each ArcEntry to the correct Entry.
// 5. Create field on entries for entryType.
// 6. Create JournalEntry object and populate with entries.
// 7. Create CommentEntry object.
// 8. Create Comment object.

import { ContentState } from "draft-js";
import { stringifyContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { v4 as uuidv4 } from "uuid";

export const migrateArcEntries = (data: any) => {
  // 1. 5. 6.
  data.journalEntries = {};

  Object.entries(data.entries as { [key: string]: any }).forEach(
    ([entryKey, entry]) => {
      const timeMachine = IpsumTimeMachine.create(entry.contentState);
      entry.trackedContentState = timeMachine.toString();
      entry.entryType = "JOURNAL";
      delete entry.contentState;

      const history = {
        __typename: "History",
        dateCreated: IpsumDateTime.fromString(
          entryKey,
          "entry-printed-date"
        ).dateTime.toISO(),
      };
      entry.history = history;

      data.journalEntries[entry.entryKey] = {
        __typename: "JournalEntry",
        entryKey,
        entry: entryKey,
      };
    }
  );

  // 2. 3. 4.
  data.arcEntries = {};

  Object.entries(data.arcs as { [key: string]: any }).forEach(
    ([arcId, arc]) => {
      arc.history = {
        __typename: "History",
        dateCreated: new Date().toISOString(),
      };

      const arcEntryKey = `arc-entry:${arc.name}:${uuidv4()}`;
      const blankTimeMachine = IpsumTimeMachine.create(
        stringifyContentState(ContentState.createFromText(""))
      );
      data.entries[arcEntryKey] = {
        __typename: "Entry",
        entryKey: arcEntryKey,
        trackedContentState: blankTimeMachine.toString(),
        history: {
          __typename: "History",
          dateCreated: new Date().toISOString(),
        },
        entryType: "ARC",
      };

      data.arcEntries[arcEntryKey] = {
        __typename: "ArcEntry",
        entry: arcEntryKey,
        arc: arcId,
      };

      arc.arcEntry = arcEntryKey;
    }
  );

  Object.entries(data.highlights as { [key: string]: any }).forEach(
    ([key, highlight]) => {
      highlight.history = {
        __typename: "History",
        dateCreated: new Date().toISOString(),
      };
    }
  );

  // 7. 8.
  data.commentEntries = {};
  data.comments = {};
};
