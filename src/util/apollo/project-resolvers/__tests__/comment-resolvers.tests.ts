import { gql } from "@apollo/client";
import { createComment } from "util/api/project-actions/comment/create-comment";
import { createEntry } from "util/api/project-actions/entry/create-entry";
import { createHighlight } from "util/api/project-actions/highlight/create-highlight";
import { EntryType } from "util/apollo/__generated__/graphql";
import { client } from "util/apollo/client";
import { IpsumDay } from "util/dates";
import { PROJECT_STATE } from "util/state";
import { dangerous_initializeProjectState } from "util/state/IpsumStateContext";

describe("Comment resolvers", () => {
  beforeEach(() => {
    dangerous_initializeProjectState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  describe("root queries", () => {
    test("should query a single comment", () => {
      createEntry(
        {
          entryKey: "1/1/2020",
          entryType: EntryType.Journal,
          htmlString: "<div>hello world</div>",
        },
        { projectState: PROJECT_STATE }
      );
      const highlight = createHighlight(
        {
          entryKey: "1/1/2020",
          dayCreated: IpsumDay.fromString("1/1/2020", "stored-day"),
        },
        { projectState: PROJECT_STATE }
      );
      const comment = createComment(
        {
          dayCreated: IpsumDay.fromString("1/6/2020", "stored-day"),
          objectHighlight: highlight.id,
          htmlString: "<div>goodbye world</div>",
        },
        { projectState: PROJECT_STATE }
      );

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
              objectHighlight {
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
      expect(result.comment.commentEntry.entry.htmlString).toEqual(
        "<div>goodbye world</div>"
      );
    });

    test("should query multiple comments", () => {
      createEntry(
        {
          entryKey: "1/1/2020",
          entryType: EntryType.Journal,
          htmlString: "<p>unrelated journal content</p>",
        },
        { projectState: PROJECT_STATE }
      );
      const highlight = createHighlight(
        {
          entryKey: "1/1/2020",
          dayCreated: IpsumDay.fromString("1/1/2020", "stored-day"),
        },
        { projectState: PROJECT_STATE }
      );
      const comment1 = createComment(
        {
          objectHighlight: highlight.id,
          dayCreated: IpsumDay.fromString("1/6/2020", "stored-day"),
          htmlString: "<p>comment 1</p>",
        },
        { projectState: PROJECT_STATE }
      );
      const comment2 = createComment(
        {
          objectHighlight: highlight.id,
          dayCreated: IpsumDay.fromString("1/7/2020", "stored-day"),
          htmlString: "<p>comment 2</p>",
        },
        { projectState: PROJECT_STATE }
      );

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
              objectHighlight {
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
      expect(result.comments[0].commentEntry.entry.htmlString).toEqual(
        "<p>comment 1</p>"
      );
      expect(result.comments[1].id).toEqual(comment2.id);
      expect(result.comments[1].commentEntry.entry.entryKey).toEqual(
        `comment-entry:${comment2.id}`
      );
      expect(result.comments[1].commentEntry.entry.htmlString).toEqual(
        "<p>comment 2</p>"
      );
    });
  });
});
