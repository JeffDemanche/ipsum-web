import { EntryType } from "util/apollo/__generated__/graphql";
import { initializeState, vars } from "util/apollo/client";
import { IpsumDateTime } from "util/dates";

import { createComment, deleteComment } from "../comments";
import { createEntry } from "../entries";
import { createHighlight } from "../highlights";

jest.mock("../../autosave");

describe("apollo comments API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createComment", () => {
    it("should create a comment with default fields", () => {
      createEntry({
        entryKey: "1/2/2020",
        htmlString: "",
        entryType: EntryType.Journal,
      });
      const { id: highlightId } = createHighlight({ entry: "1/2/2020" });
      const comment = createComment({ highlight: highlightId });
      expect(comment).toEqual(
        expect.objectContaining({
          __typename: "Comment",
          id: comment.id,
          commentEntry: expect.any(String),
          highlight: highlightId,
          history: {
            __typename: "History",
            dateCreated: IpsumDateTime.today().toString("iso"),
          },
        })
      );
    });

    it("should throw an error if the highlight does not exist", () => {
      expect(() => createComment({ highlight: "123" })).toThrow(
        "createComment: highlight 123 not found"
      );
    });
  });

  describe("deleteComment", () => {
    it("should delete the comment", () => {
      createEntry({
        entryKey: "1/2/2020",
        htmlString: "",
        entryType: EntryType.Journal,
      });
      const { id: highlightId } = createHighlight({ entry: "1/2/2020" });
      const comment = createComment({ highlight: highlightId });
      expect(vars.comments()[comment.id]).toBeDefined();
      expect(vars.commentEntries()[comment.commentEntry]).toBeDefined();
      expect(vars.entries()[comment.commentEntry]).toBeDefined();

      deleteComment(comment.id);

      expect(vars.comments()[comment.id]).toBeUndefined();
      expect(vars.commentEntries()[comment.commentEntry]).toBeUndefined();
      expect(vars.entries()[comment.commentEntry]).toBeUndefined();
    });
  });
});
