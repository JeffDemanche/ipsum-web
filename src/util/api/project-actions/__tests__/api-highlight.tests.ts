import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state";

import { apiCreateEntry, apiCreateHighlight } from "..";

describe("API highlight actions", () => {
  describe("createHighlight", () => {
    test("should reject if the entry does not exist", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      expect(() =>
        apiCreateHighlight(
          { entryKey: "entry-key", dayCreated },
          { projectState: state }
        )
      ).toThrowError("No entry with key entry-key exists in the project state");
    });

    test("should create a highlight", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      apiCreateEntry(
        {
          entryKey: "entry-key",
          dayCreated,
          htmlString: "<div>hello world</div>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );
      const highlight = apiCreateHighlight(
        { entryKey: "entry-key", dayCreated },
        { projectState: state }
      );

      const highlightInState = state.collection("highlights").get(highlight.id);
      expect(highlightInState).toEqual(highlight);
      expect(highlightInState.entry).toEqual("entry-key");
      expect(highlightInState.history.dateCreated).toEqual(
        dayCreated.toString("iso")
      );
    });
  });
});
