import { gql } from "@apollo/client";
import { createArc, createRelation, EntryType } from "util/apollo";
import { createEntry } from "util/apollo/api/entries";
import { createHighlight } from "util/apollo/api/highlights";
import { client, initializeState } from "util/apollo/client";

jest.mock("../../autosave");

describe("Search resolvers", () => {
  beforeEach(() => {
    initializeState();
  });

  afterEach(async () => {
    jest.useRealTimers();
    await client.clearStore();
  });

  describe("root queries", () => {
    it("should return highlight with outgoing relation to relatesToArc for single and clause", () => {
      jest.useFakeTimers().setSystemTime(new Date("2020-01-02"));

      const arc = createArc({ name: "test arc 1" });
      const entry = createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
      });
      createHighlight({
        entry: entry.entryKey,
        outgoingRelations: [],
      });
      const highlight1 = createHighlight({
        entry: entry.entryKey,
        outgoingRelations: [],
      });
      createRelation({
        subject: highlight1.id,
        object: arc.id,
        predicate: "relatesTo",
        subjectType: "Highlight",
        objectType: "Arc",
      });

      const result = client.readQuery({
        query: gql(`
          query SearchHighlights($criteria: SearchCriteria!) {
            searchHighlights(criteria: $criteria) {
              id
            }
          }
        `),
        variables: {
          criteria: {
            and: [
              {
                or: [
                  {
                    relatesToArc: {
                      arcId: arc.id,
                    },
                  },
                ],
              },
            ],
          },
        },
      });

      expect(result.searchHighlights).toHaveLength(1);
      expect(result.searchHighlights[0].id).toEqual(highlight1.id);
    });

    it("should return highlights with relatesToHighlight for multiple and clauses", () => {
      const entry = createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
      });
      const highlight1 = createHighlight({
        entry: entry.entryKey,
        outgoingRelations: [],
      });
      createHighlight({
        entry: entry.entryKey,
        outgoingRelations: [],
      });
      const highlight3 = createHighlight({
        entry: entry.entryKey,
        outgoingRelations: [],
      });
      const arc = createArc({ name: "test arc 1" });
      createRelation({
        subject: highlight1.id,
        object: arc.id,
        predicate: "relates to",
        subjectType: "Highlight",
        objectType: "Arc",
      });
      createRelation({
        subject: highlight3.id,
        object: arc.id,
        predicate: "relates to",
        subjectType: "Highlight",
        objectType: "Arc",
      });

      const result = client.readQuery({
        query: gql(`
          query SearchHighlights($criteria: SearchCriteria!) {
            searchHighlights(criteria: $criteria) {
              id
            }
          }
        `),
        variables: {
          criteria: {
            and: [
              {
                or: [
                  {
                    relatesToHighlight: {
                      highlightId: highlight1.id,
                    },
                  },
                ],
              },
            ],
          },
        },
      });

      expect(result.searchHighlights).toHaveLength(2);
      expect(result.searchHighlights[0].id).toEqual(highlight1.id);
      expect(result.searchHighlights[1].id).toEqual(highlight3.id);
    });

    it("should return highlights with correct entry date for single and clause", () => {
      jest.useFakeTimers().setSystemTime(new Date(2020, 0, 2));
      const entry1 = createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
      });
      jest.useFakeTimers().setSystemTime(new Date(2020, 0, 3));
      const entry2 = createEntry({
        entryKey: "1/3/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
      });
      const highlight1 = createHighlight({
        entry: entry1.entryKey,
      });
      createHighlight({
        entry: entry2.entryKey,
      });

      const result = client.readQuery({
        query: gql(`
          query SearchHighlights($criteria: SearchCriteria!) {
            searchHighlights(criteria: $criteria) {
              id
            }
          }
        `),
        variables: {
          criteria: { and: [{ or: [{ days: { days: ["01-02-2020"] } }] }] },
        },
      });

      expect(result.searchHighlights).toHaveLength(1);
      expect(result.searchHighlights[0].id).toEqual(highlight1.id);
    });
  });
});
