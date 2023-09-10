import { gql } from "@apollo/client";
import { ContentState } from "draft-js";
import { createArc, createRelation, EntryType } from "util/apollo";
import { createEntry } from "util/apollo/api/entries";
import { createHighlight } from "util/apollo/api/highlights";
import { createSRSCard } from "util/apollo/api/srs";
import { client, initializeState } from "util/apollo/client";
import { stringifyContentState } from "util/content-state";

jest.mock("../../autosave");

describe("Highlight resolvers", () => {
  beforeEach(() => {
    initializeState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  describe("root queries", () => {
    it("should query a single highlight", () => {
      const arc = createArc({ name: "test arc 1" });
      const entry = createEntry({
        entryKey: "1/2/2020",
        stringifiedContentState: stringifyContentState(
          ContentState.createFromText("Hello, world!")
        ),
        entryType: EntryType.Journal,
      });
      const highlight = createHighlight({
        entry: entry.entryKey,
      });
      createRelation({
        object: arc.id,
        objectType: "Arc",
        predicate: "relates to",
        subject: highlight.id,
        subjectType: "Highlight",
      });

      const result = client.readQuery({
        query: gql(`
        query ReadHighlight($highlight: ID!) {
          highlight(id: $highlight) {
            id
            outgoingRelations {
              object {
                __typename
                ... on Arc {
                  id
                  name
                  color
                }
              }
            }
            entry {
              entryKey
            }
          }
        }
      `),
        variables: {
          highlight: highlight.id,
        },
      });

      expect(result.highlight.id).toEqual(highlight.id);
      expect(result.highlight.outgoingRelations[0].object.id).toEqual(arc.id);
      expect(result.highlight.outgoingRelations[0].object.name).toEqual(
        arc.name
      );
      expect(result.highlight.entry).toEqual({
        __typename: "Entry",
        entryKey: "1/2/2020",
      });
    });
  });

  describe("field queries", () => {
    it("should query srs cards for a highlight", () => {
      const highlight = createHighlight({ entry: "1/2/2020" });
      const srsCard = createSRSCard({
        subjectType: "Highlight",
        subjectId: highlight.id,
      });

      const result = client.readQuery({
        query: gql(`
        query ReadHighlight($highlight: ID!) {
          highlight(id: $highlight) {
            id
            srsCards {
              id
            }
          }
        }
      `),
        variables: {
          highlight: highlight.id,
        },
      });

      expect(result.highlight.id).toEqual(highlight.id);
      expect(result.highlight.srsCards[0].id).toEqual(srsCard.id);
    });
  });
});
