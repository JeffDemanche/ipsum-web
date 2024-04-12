import { createJournalEntry } from "util/apollo";
import { EntryType } from "util/apollo/__generated__/graphql";
import { initializeState, vars } from "util/apollo/client";

import { deleteJournalEntry } from "../journalEntries";

jest.mock("../../autosave");

describe("apollo journalEntries API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createJournalEntry", () => {
    it("should create journalEntry and underlying entry", () => {
      createJournalEntry({
        entryKey: "1/1/20",
        entryType: EntryType.Journal,
        htmlString: "<p>Hello, world!</p>",
      });

      expect(vars.journalEntries()["1/1/20"]).toBeDefined();
      expect(vars.entries()["1/1/20"]).toBeDefined();
    });
  });

  describe("deleteJournalEntry", () => {
    it("should delete journalEntry and underlying entry", () => {
      createJournalEntry({
        entryKey: "1/1/20",
        entryType: EntryType.Journal,
        htmlString: "<p>Hello, world!</p>",
      });

      expect(vars.journalEntries()["1/1/20"]).toBeDefined();
      expect(vars.entries()["1/1/20"]).toBeDefined();

      deleteJournalEntry({ entryKey: "1/1/20" });

      expect(vars.journalEntries()["1/1/20"]).toBeUndefined();
      expect(vars.entries()["1/1/20"]).toBeUndefined();
    });
  });
});
