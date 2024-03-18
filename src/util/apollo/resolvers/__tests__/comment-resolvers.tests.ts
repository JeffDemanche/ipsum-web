import { gql } from "@apollo/client";
import { EntryType } from "util/apollo/__generated__/graphql";
import { createComment } from "util/apollo/api/comments";
import { createEntry } from "util/apollo/api/entries";
import { createHighlight } from "util/apollo/api/highlights";
import { client, initializeState } from "util/apollo/client";

jest.mock("../../autosave");

describe("Comment resolvers", () => {
  beforeEach(() => {
    initializeState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  describe("root queries", () => {
    it("should query a single comment", () => {
      createEntry({
        entryKey: "1/1/2020",
        entryType: EntryType.Journal,
        htmlString: "test",
      });
      const highlight = createHighlight({
        entry: "1/1/2020",
      });
      const comment = createComment({
        highlight: highlight.id,
      });

      const result = client.readQuery({
        query: gql(`
          query ReadComment($commentId: ID!) {
            comment(id: $commentId) {
              id
              commentEntry {
                entry {
                  entryKey
                  htmlString
                }
              }
              highlight {
                id
              }
            }
          }
        `),
        variables: { commentId: comment.id },
      });

      expect(result.comment.id).toEqual(comment.id);
      expect(result.comment.commentEntry.entry.entryKey).toEqual(
        `comment-entry:${comment.id}`
      );
      expect(result.comment.commentEntry.entry.htmlString).toEqual("");
    });

    it("should query multiple comments", () => {
      createEntry({
        entryKey: "1/1/2020",
        entryType: EntryType.Journal,
        htmlString: "test",
      });
      const highlight = createHighlight({
        entry: "1/1/2020",
      });
      const comment1 = createComment({
        highlight: highlight.id,
      });
      const comment2 = createComment({
        highlight: highlight.id,
      });

      const result = client.readQuery({
        query: gql(`
          query ReadComments($commentIds: [ID!]) {
            comments(ids: $commentIds) {
              id
              commentEntry {
                entry {
                  entryKey
                  htmlString
                }
              }
              highlight {
                id
              }
            }
          }
        `),
        variables: { commentIds: [comment1.id, comment2.id] },
      });

      expect(result.comments[0].id).toEqual(comment1.id);
      expect(result.comments[0].commentEntry.entry.entryKey).toEqual(
        `comment-entry:${comment1.id}`
      );
      expect(result.comments[0].commentEntry.entry.htmlString).toEqual("");
      expect(result.comments[1].id).toEqual(comment2.id);
      expect(result.comments[1].commentEntry.entry.entryKey).toEqual(
        `comment-entry:${comment2.id}`
      );
      expect(result.comments[1].commentEntry.entry.htmlString).toEqual("");
    });
  });
});
