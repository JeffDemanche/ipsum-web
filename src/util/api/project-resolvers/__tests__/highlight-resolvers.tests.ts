import { gql } from "@apollo/client";
import { createArc, createRelation, EntryType } from "util/apollo";
import { createEntry } from "util/apollo/api/entries";
import {
  createHighlight,
  rateHighlightImportance,
} from "util/apollo/api/highlights";
import { client, initializeState } from "util/apollo/client";
import { IpsumDateTime } from "util/dates";

jest.mock("../../autosave");

describe("Highlight resolvers", () => {
  let todaySpy = jest.spyOn(IpsumDateTime, "today");

  beforeEach(() => {
    initializeState();
    todaySpy = jest.spyOn(IpsumDateTime, "today");
  });

  afterEach(async () => {
    await client.clearStore();
    jest.restoreAllMocks();
  });

  describe("root queries", () => {
    it("should query a single highlight", () => {
      const arc = createArc({ name: "test arc 1" });
      const entry = createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
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

    it("queries highlights with specified arcs", () => {
      const arc1 = createArc({ name: "test arc 1" });
      const arc2 = createArc({ name: "test arc 2" });
      createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
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

    it("sorts ten highlights by date descending", () => {
      Array.from({ length: 10 }, (_, i) => {
        todaySpy.mockReturnValue(
          IpsumDateTime.fromString(`1/${i + 1}/2020`, "entry-printed-date")
        );
        return createHighlight({
          entry: `1/${i + 1}/2020`,
        });
      });

      const result = client.readQuery({
        query: gql(`
            query ReadHighlights {
              highlights(sort: DATE_DESC) {
                id
                history {
                  dateCreated
                }
              }
            }
          `),
        variables: {},
      });

      expect(result.highlights.length).toEqual(10);
      expect(result.highlights[0].history.dateCreated).toEqual(
        IpsumDateTime.fromString("1/10/2020", "entry-printed-date").toString(
          "iso"
        )
      );
      expect(result.highlights[9].history.dateCreated).toEqual(
        IpsumDateTime.fromString("1/1/2020", "entry-printed-date").toString(
          "iso"
        )
      );
    });

    it("sorts three highlights by importance descending", () => {
      todaySpy.mockReturnValue(
        IpsumDateTime.fromString("1/1/2020", "entry-printed-date")
      );
      const highlight1 = createHighlight({
        entry: "1/1/2020",
      });
      rateHighlightImportance({
        highlightId: highlight1.id,
        rating: 1,
      });

      todaySpy.mockReturnValue(
        IpsumDateTime.fromString("1/2/2020", "entry-printed-date")
      );
      const highlight2 = createHighlight({
        entry: "1/2/2020",
      });
      rateHighlightImportance({
        highlightId: highlight1.id,
        rating: 1,
      });
      rateHighlightImportance({
        highlightId: highlight2.id,
        rating: 1,
      });

      todaySpy.mockReturnValue(
        IpsumDateTime.fromString("1/3/2020", "entry-printed-date")
      );
      const highlight3 = createHighlight({
        entry: "1/3/2020",
      });
      rateHighlightImportance({
        highlightId: highlight1.id,
        rating: 1,
      });
      rateHighlightImportance({
        highlightId: highlight2.id,
        rating: 1,
      });
      rateHighlightImportance({
        highlightId: highlight3.id,
        rating: 1,
      });

      const result = client.readQuery({
        query: gql(`
            query ReadHighlights {
              highlights(sort: IMPORTANCE_DESC) {
                id
                currentImportance
              }
            }
          `),
        variables: {},
      });

      expect(result.highlights.length).toEqual(3);
      expect(result.highlights[0].id).toEqual(highlight1.id);
      expect(result.highlights[0].currentImportance).toBeCloseTo(2.73);
      expect(result.highlights[1].id).toEqual(highlight2.id);
      expect(result.highlights[1].currentImportance).toBeCloseTo(1.91);
      expect(result.highlights[2].id).toEqual(highlight3.id);
      expect(result.highlights[2].currentImportance).toBeCloseTo(1);
    });
  });

  describe("field queries", () => {});
});
