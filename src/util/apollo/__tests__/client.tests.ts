import { gql } from "@apollo/client";
import { createArc } from "../api/arcs";
import { createEntry } from "../api/entries";
import { createHighlight } from "../api/highlights";
import { vars, client, initializeState } from "../client";

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
        arc: arc1.id,
        entry: "1/2/2020",
      });
      createHighlight({
        arc: arc2.id,
        entry: "1/2/2020",
      });

      const result = client.readQuery({
        query: gql(`
          query ReadHighlights($arc: [ID!]) {
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
          arcs: [arc1.id],
        },
      });

      expect(result.highlights).toHaveLength(1);
      expect(result.highlights[0].id).toEqual(highlight1.id);
    });

    it("queries a single highlight", () => {
      const arc = createArc({ name: "test arc 1" });
      const entry = createEntry({
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      });
      const highlight = createHighlight({
        arc: arc.id,
        entry: entry.entryKey,
      });

      const result = client.readQuery({
        query: gql(`
          query ReadHighlight($highlight: ID!) {
            highlight(id: $highlight) {
              id
              arc {
                id
                name
                color
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
      expect(result.highlight.arc).toEqual(vars.arcs()[arc.id]);
      expect(result.highlight.entry).toEqual(vars.entries()[entry.entryKey]);
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
      createHighlight({
        arc: arc.id,
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

      expect(result.highlights[0].arc).toEqual(vars.arcs()[arc.id]);
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
        arc: "",
        entry: "1/2/2020",
      });
      const highlight2 = createHighlight({
        arc: "",
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
  });
});
