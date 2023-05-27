import { gql } from "@apollo/client";
import { createArc } from "../api/arcs";
import { createEntry } from "../api/entries";
import { createHighlight } from "../api/highlights";
import { createRelation } from "../api/relations";
import { vars, client, initializeState } from "../client";

jest.mock("../autosave");

describe("apollo client", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("root queries", () => {
    it("queries entries with specified entry keys", () => {
      createEntry({
        entryKey: "1/1/2020",
        date: "1/1/2020",
        contentState: "Hello, world!",
      });
      createEntry({
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      });

      const result = client.readQuery({
        query: gql(`
          query ReadEntry($entryKeys: [ID!]) {
            entries(entryKeys: $entryKeys) {
              entryKey
              date
              contentState
            }
          }
        `),
        variables: {
          entryKeys: ["1/2/2020"],
        },
      });

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].entryKey).toEqual("1/2/2020");
    });

    it("queries highlights with specified arcs", () => {
      const arc1 = createArc({ name: "test arc 1" });
      const arc2 = createArc({ name: "test arc 2" });
      createEntry({
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      });
      const highlight1 = createHighlight({
        entry: "1/2/2020",
      });
      const highlight2 = createHighlight({
        entry: "1/2/2020",
      });
      createRelation({
        object: arc1.id,
        objectType: "Arc",
        subject: highlight1.id,
        subjectType: "Highlight",
        predicate: "relates to",
      });
      createRelation({
        object: arc2.id,
        objectType: "Arc",
        subject: highlight2.id,
        subjectType: "Highlight",
        predicate: "relates to",
      });

      const result = client.readQuery({
        query: gql(`
          query ReadHighlights($arc: [ID!]) {
            highlights(arcs: $arcs) {
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
                date
                contentState
              }
            }
          }
        `),
        variables: {
          arcs: [arc1.id],
        },
      });

      expect(result.highlights).toHaveLength(1);
      expect(result.highlights[0].id).toEqual(highlight1.id);
      expect(result.highlights[0].outgoingRelations[0].object.id).toEqual(
        arc1.id
      );
    });

    it("queries a single highlight", () => {
      const arc = createArc({ name: "test arc 1" });
      const entry = createEntry({
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
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

  describe("hydration", () => {
    it("should hydrate highlight arcs and entries", () => {
      const arc = createArc({ name: "test arc 1" });
      const entry = createEntry({
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      });
      const highlight = createHighlight({
        entry: "1/2/2020",
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
          query ReadHighlight {
            highlights {
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
                date
                contentState
              }
            }
          }
        `),
      });

      expect(result.highlights[0].outgoingRelations[0].object.id).toEqual(
        arc.id
      );
      expect(result.highlights[0].outgoingRelations[0].object.name).toEqual(
        arc.name
      );
      expect(result.highlights[0].entry).toEqual(
        vars.entries()[entry.entryKey]
      );
    });

    it("should hydrate entry highlights", () => {
      createEntry({
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      });
      createEntry({
        entryKey: "1/4/2020",
        date: "1/4/2020",
        contentState: "Hello, world!",
      });
      const highlight1 = createHighlight({
        entry: "1/2/2020",
      });
      const highlight2 = createHighlight({
        entry: "1/2/2020",
      });

      const result = client.readQuery({
        query: gql(`
          query ReadEntry($entryKeys: [ID!]!) {
            entries(entryKeys: $entryKeys) {
              entryKey
              highlights {
                id
              }
            } 
          }
        `),
        variables: {
          entryKeys: ["1/2/2020", "1/4/2020"],
        },
      });

      expect(result.entries[0].highlights).toHaveLength(2);
      expect(result.entries[0].highlights[0].id).toEqual(highlight1.id);
      expect(result.entries[0].highlights[1].id).toEqual(highlight2.id);
      expect(result.entries[1].highlights).toHaveLength(0);
    });

    it("should hydrate relations", () => {
      const highlight1 = createHighlight({
        entry: "1/2/2020",
        outgoingRelations: [],
      });
      const arc1 = createArc({ name: "test arc 1" });
      const relation1 = createRelation({
        object: arc1.id,
        objectType: "Arc",
        subject: highlight1.id,
        subjectType: "Highlight",
        predicate: "relates to",
      });

      const result = client.readQuery({
        query: gql(`
          query ReadRelation($id: ID!) {
            relation(id: $id) {
              id
              subject {
                __typename
                ... on Highlight {
                  id
                }
                ... on Arc {
                  id
                }
              }
              object {
                __typename
                id
                name
              }
            } 
          }
        `),
        variables: {
          id: relation1.id,
        },
      });

      expect(result.relation.id).toEqual(relation1.id);
      expect(result.relation.subject.__typename).toEqual("Highlight");
      expect(result.relation.object.__typename).toEqual("Arc");
    });
  });
});
