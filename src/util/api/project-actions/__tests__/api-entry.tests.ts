import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { ProjectState } from "util/state/project";

import { createJournalEntry } from "../entry/create-journal-entry";

describe("API entry actions", () => {
  describe("createEntry", () => {
    it("should create an entry and a journalEntry", async () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      const journalEntry = await createJournalEntry(
        {
          dayCreated,
          entryKey: "entry1",
          htmlString: "<div>hello world</div>",
        },
        { projectState: state }
      );

      expect(state.collection("journalEntries").get("entry1")).toEqual(
        journalEntry
      );
      const entry = state.collection("entries").get("entry1");
      expect(entry).toBeDefined();
      expect(entry?.entryKey).toEqual("entry1");
      expect(
        IpsumTimeMachine.fromString(entry?.trackedHTMLString).currentValue
      ).toEqual("<div>hello world</div>");
      expect(entry?.entryType).toEqual(EntryType.Journal);
      expect(entry?.history.dateCreated).toEqual(dayCreated.toString("iso"));
    });
  });
});
