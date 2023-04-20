import { vars, initializeState } from "util/apollo/client";
import { createEntry, deleteEntry, updateEntry } from "../entries";

describe("apollo entries API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createEntry", () => {
    it("should add entries to the state", () => {
      const entry1 = {
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      };
      const entry2 = {
        entryKey: "4/2/2020",
        date: "4/2/2020",
        contentState: "Hello, world 2!",
      };
      createEntry(entry1);
      expect(vars.entries()).toEqual([entry1]);
      createEntry(entry2);
      expect(vars.entries()).toEqual([entry1, entry2]);
    });
  });

  describe("updateEntry", () => {
    it("should update entries in the state", () => {
      const entry1 = {
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      };
      const entry2 = {
        entryKey: "4/2/2020",
        date: "4/2/2020",
        contentState: "Hello, world 2!",
      };
      createEntry(entry1);
      createEntry(entry2);
      expect(vars.entries()).toEqual([entry1, entry2]);
      updateEntry({ entryKey: "1/2/2020", contentState: "Hello, world 3!" });
      expect(vars.entries()).toEqual([
        { ...entry1, contentState: "Hello, world 3!" },
        entry2,
      ]);
    });
  });

  describe("deleteEntry", () => {
    it("should delete entries from the state", () => {
      const entry1 = {
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      };
      const entry2 = {
        entryKey: "4/2/2020",
        date: "4/2/2020",
        contentState: "Hello, world 2!",
      };
      createEntry(entry1);
      createEntry(entry2);
      expect(vars.entries()).toEqual([entry1, entry2]);
      deleteEntry("1/2/2020");
      expect(vars.entries()).toEqual([entry2]);
    });
  });
});
