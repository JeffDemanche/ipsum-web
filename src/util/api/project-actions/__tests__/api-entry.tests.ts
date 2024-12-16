import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { ProjectState } from "util/state/project";

import { createArcEntry } from "../entry/create-arc-entry";
import { createJournalEntry } from "../entry/create-journal-entry";
import { deleteJournalEntry } from "../entry/delete-journal-entry";
import { updateArcEntry } from "../entry/update-arc-entry";
import { updateJournalEntry } from "../entry/update-journal-entry";

describe("API entry actions", () => {
  describe("createEntry", () => {
    it("should create an entry and a journalEntry", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      const journalEntry = createJournalEntry(
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

  describe("Journal Entry", () => {
    describe("updateJournalEntry", () => {
      it("should update an entry and a journalEntry", () => {
        const state = new ProjectState();
        const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

        const journalEntry = createJournalEntry(
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

        const updatedJournalEntry = {
          entryKey: "entry1",
          htmlString: "<div>goodbye world</div>",
        };

        updateJournalEntry(updatedJournalEntry, { projectState: state });

        const entry = state.collection("entries").get("entry1");

        expect(entry).toBeDefined();
        expect(
          IpsumTimeMachine.fromString(entry?.trackedHTMLString).currentValue
        ).toEqual("<div>goodbye world</div>");
      });

      it("should delete an entry and a journalEntry if the htmlString is empty", () => {
        const state = new ProjectState();
        const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

        const journalEntry = createJournalEntry(
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

        updateJournalEntry(
          {
            entryKey: "entry1",
            htmlString: "<p></p>",
          },
          { projectState: state }
        );

        expect(
          state.collection("journalEntries").get("entry1")
        ).toBeUndefined();
      });
    });

    describe("deleteJournalEntry", () => {
      it("should delete an entry and a journalEntry", () => {
        const state = new ProjectState();
        const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

        const journalEntry = createJournalEntry(
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

        deleteJournalEntry({ entryKey: "entry1" }, { projectState: state });

        expect(
          state.collection("journalEntries").get("entry1")
        ).toBeUndefined();
      });
    });
  });

  describe("Arc Entry", () => {
    describe("createArcEntry", () => {
      it("should create an entry and an arcEntry", () => {
        const state = new ProjectState();
        const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

        const arcEntry = createArcEntry(
          {
            dayCreated,
            arcId: "arc1",
            arcName: "fun",
            htmlString: "<div>hello world</div>",
          },
          { projectState: state }
        );

        expect(
          state.collection("arcEntries").get("arc-entry:fun:arc1")
        ).toEqual(arcEntry);
        const entry = state.collection("entries").get("arc-entry:fun:arc1");
        expect(entry).toBeDefined();
        expect(entry?.entryKey).toEqual("arc-entry:fun:arc1");
        expect(
          IpsumTimeMachine.fromString(entry?.trackedHTMLString).currentValue
        ).toEqual("<div>hello world</div>");
      });
    });

    describe("updateArcEntry", () => {
      it("should update an entry and an arcEntry", () => {
        const state = new ProjectState();

        const theSeventh = IpsumDay.fromString("1/7/2020", "stored-day");
        const theEighth = IpsumDay.fromString("1/8/2020", "stored-day");

        const arcEntry = createArcEntry(
          {
            dayCreated: theSeventh,
            arcId: "arc1",
            arcName: "fun",
            htmlString: "<div>hello world</div>",
          },
          { projectState: state }
        );

        expect(
          state.collection("arcEntries").get("arc-entry:fun:arc1")
        ).toEqual(arcEntry);

        const updatedArcEntry = {
          entryKey: "arc-entry:fun:arc1",
          htmlString: "<div>goodbye world</div>",
          updateDay: theEighth,
        };

        updateArcEntry(updatedArcEntry, { projectState: state });

        const entry = state.collection("entries").get("arc-entry:fun:arc1");

        expect(entry).toBeDefined();
        const timeMachine = IpsumTimeMachine.fromString(
          entry?.trackedHTMLString
        );
        expect(timeMachine.valueAtDate(theEighth.toJsDate())).toEqual(
          "<div>goodbye world</div>"
        );
        expect(timeMachine.valueAtDate(theSeventh.toJsDate())).toEqual(
          "<div>hello world</div>"
        );
      });
    });
  });
});
