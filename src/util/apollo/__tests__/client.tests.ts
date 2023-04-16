import { gql } from "@apollo/client";
import { createArc } from "../api/arcs";
import { createEntry } from "../api/entries";
import { createHighlight } from "../api/highlights";
import { arcs, client, entries, initializeState } from "../client";

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
          query ReadEntry($ids: [ID!]) {
            entries(ids: $ids) {
              entryKey
              date
              contentState
            }
          }
        `),
        variables: {
          ids: ["1/2/2020"],
        },
      });

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].entryKey).toEqual("1/2/2020");
    });

    it("queries highlights with specified arcs", () => {
      createArc({ name: "test arc 1" });
      createArc({ name: "test arc 2" });
      createEntry({
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      });
      createHighlight({
        id: "highlight 1",
        arc: arcs()[0].id,
        entry: "1/2/2020",
      });
      createHighlight({
        id: "highlight 2",
        arc: arcs()[1].id,
        entry: "1/2/2020",
      });

      const result = client.readQuery({
        query: gql(`
          query ReadHighlight($arc: [ID!]) {
            highlights(arcs: $arcs) {
              id
              arc {
                id
                name
                color
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
          arcs: [arcs()[0].id],
        },
      });

      expect(result.highlights).toHaveLength(1);
      expect(result.highlights[0].id).toEqual("highlight 1");
    });
  });

  describe("hydration", () => {
    it("should hydrate highlight arcs and entries", () => {
      createArc({ name: "test arc 1" });
      createEntry({
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      });
      createHighlight({
        id: "highlight",
        arc: arcs()[0].id,
        entry: "1/2/2020",
      });

      const result = client.readQuery({
        query: gql(`
          query ReadHighlight {
            highlights {
              id
              arc {
                id
                name
                color
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

      expect(result.highlights[0].arc).toEqual(arcs()[0]);
      expect(result.highlights[0].entry).toEqual(entries()[0]);
    });
  });
});
