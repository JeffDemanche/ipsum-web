import { IpsumDateTime } from "util/dates";
import { dispatch, InMemoryAction } from "../in-memory-actions";
import {
  InMemoryCollections,
  InMemoryState,
  WritableInMemoryState,
} from "../in-memory-schema";
import {
  initializeDefaultDocument,
  initializeDefaultInMemoryState,
} from "../in-memory-state";

const reducer = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  return dispatch(state, action);
};

describe("InMemoryState Reducer", () => {
  describe("OVERWRITE", () => {
    it("creates empty indices for blank state", () => {
      const afterState = reducer(initializeDefaultInMemoryState(), {
        type: "OVERWRITE",
        payload: { newState: initializeDefaultInMemoryState() },
      });
      expect(afterState.__indices.arc).toEqual({ name: {} });
      expect(afterState.__indices.highlight).toEqual({
        entryKey: {},
        arcId: {},
      });
    });

    it("creates indices for everything if specified", () => {
      const defaultState: WritableInMemoryState =
        initializeDefaultInMemoryState();
      defaultState["highlight"]["highlight_1"] = {
        id: "highlight_1",
        arcId: "arc_id",
        entryKey: "entry_key_1",
      };
      defaultState["highlight"]["highlight_2"] = {
        id: "highlight_2",
        arcId: "arc_id",
        entryKey: "entry_key_2",
      };
      const afterState = reducer(defaultState, {
        type: "OVERWRITE",
        payload: { newState: defaultState },
      });
      expect(afterState.__indices.highlight.entryKey["entry_key_1"]).toEqual([
        "highlight_1",
      ]);
      expect(afterState.__indices.highlight.entryKey["entry_key_2"]).toEqual([
        "highlight_2",
      ]);
      expect(afterState.__indices.highlight.arcId["arc_id"]).toEqual([
        "highlight_1",
        "highlight_2",
      ]);
    });
  });

  describe("CREATE_DOCUMENT", () => {
    it("creates an entry", () => {
      const defaultState = initializeDefaultInMemoryState();
      const afterState = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: { type: "entry", document: { entryKey: "1/1/2020" } },
      });
      expect(Object.keys(afterState.entry)).toHaveLength(1);
      expect(afterState.entry["1/1/2020"].entryKey).toEqual("1/1/2020");
    });

    it("creates a default entry with overwritten properties when document arg is partial", () => {
      const defaultState = initializeDefaultInMemoryState();
      const date = IpsumDateTime.fromString(
        "12/29/2022",
        "entry-printed-date"
      ).dateTime.toISO();
      const afterState = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "entry",
          document: {
            entryKey: "12/29/2022",
            date,
          },
        },
      });
      expect(Object.keys(afterState.entry)).toHaveLength(1);
      expect(afterState.entry["12/29/2022"].entryKey).toEqual("12/29/2022");
      expect(afterState.entry["12/29/2022"].date).toEqual(date);
    });

    it("creates indices for multiple created highlights", () => {
      const defaultState = initializeDefaultInMemoryState();
      const afterState1 = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "highlight",
          document: {
            id: "highlight_1_id",
            entryKey: "1/1/2020",
            arcId: "arc_id",
          },
        },
      });
      expect(afterState1.__indices.highlight["entryKey"]["1/1/2020"]).toEqual([
        "highlight_1_id",
      ]);
      const afterState2 = reducer(afterState1, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "highlight",
          document: {
            id: "highlight_2_id",
            entryKey: "1/1/2020",
            arcId: "arc_id",
          },
        },
      });
      expect(afterState2.__indices.highlight["entryKey"]["1/1/2020"]).toEqual([
        "highlight_1_id",
        "highlight_2_id",
      ]);
      const afterState3 = reducer(afterState2, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "highlight",
          document: {
            id: "highlight_3_id",
            entryKey: "2/2/2020",
            arcId: "arc_id",
          },
        },
      });
      expect(
        Object.keys(afterState3.__indices.highlight["entryKey"])
      ).toHaveLength(2);
      expect(afterState3.__indices.highlight["entryKey"]["1/1/2020"]).toEqual([
        "highlight_1_id",
        "highlight_2_id",
      ]);
      expect(afterState3.__indices.highlight["entryKey"]["2/2/2020"]).toEqual([
        "highlight_3_id",
      ]);
    });
  });

  describe("UPDATE_DOCUMENT", () => {
    it("updates an existing arc with new color", () => {
      const arc = initializeDefaultDocument("arc");
      const defaultState: WritableInMemoryState =
        initializeDefaultInMemoryState();

      const afterState1 = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: { type: "arc", document: arc },
      });

      const afterState2 = reducer(afterState1, {
        type: "UPDATE_DOCUMENT",
        payload: { type: "arc", key: arc.id, update: { color: 124 } },
      });
      expect(Object.values(afterState2.arc)).toHaveLength(1);
      expect(afterState2.arc[arc.id].color).toEqual(124);
      expect(afterState2.arc[arc.id].name).toEqual(
        InMemoryCollections.arc.fields.name.default()
      );
    });

    it("prevents updating primary key on an entry", () => {
      const entry = initializeDefaultDocument("entry");
      const defaultState: InMemoryState = {
        ...initializeDefaultInMemoryState(),
        entry: { [entry.entryKey]: entry },
      };
      expect(() => {
        reducer(defaultState, {
          type: "UPDATE_DOCUMENT",
          payload: {
            type: "entry",
            key: entry.entryKey,
            update: { entryKey: "test" },
          },
        });
      }).toThrowError(
        new Error(
          "UPDATE_DOCUMENT: can't set primary key value in document update for entry"
        )
      );
    });

    it("updates indices for updated highlight", () => {
      const defaultState: InMemoryState = initializeDefaultInMemoryState();
      const afterState1 = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "highlight",
          document: {
            id: "highlight_id",
            entryKey: "1/1/2020",
            arcId: "arc_id",
          },
        },
      });
      const afterState2 = reducer(afterState1, {
        type: "UPDATE_DOCUMENT",
        payload: {
          type: "highlight",
          key: "highlight_id",
          update: {
            entryKey: "1/2/2020",
          },
        },
      });
      expect(
        afterState2.__indices.highlight["entryKey"]["1/1/2020"]
      ).not.toBeDefined();
      expect(afterState2.__indices.highlight["entryKey"]["1/2/2020"]).toEqual([
        "highlight_id",
      ]);
      expect(afterState2.__indices.highlight["arcId"]["arc_id"]).toEqual([
        "highlight_id",
      ]);
    });
  });

  describe("REMOVE_DOCUMENT", () => {
    it("removes an arc assignment by id", () => {
      const highlight = initializeDefaultDocument("highlight");
      const defaultState: WritableInMemoryState =
        initializeDefaultInMemoryState();

      const afterState1 = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: { type: "highlight", document: highlight },
      });

      const afterState2 = reducer(afterState1, {
        type: "REMOVE_DOCUMENT",
        payload: { type: "highlight", key: highlight.id },
      });
      expect(Object.entries(afterState2.highlight)).toHaveLength(0);
    });

    it("removes indices for multiple added and removed highlights", () => {
      const highlight = initializeDefaultDocument("highlight");
      const defaultState: WritableInMemoryState = {
        ...initializeDefaultInMemoryState(),
      };
      defaultState.highlight[highlight.id] = highlight;
      const afterState1 = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "highlight",
          document: {
            id: "highlight_id",
            entryKey: "1/1/2020",
            arcId: "arc_1",
          },
        },
      });
      const afterState2 = reducer(afterState1, {
        type: "REMOVE_DOCUMENT",
        payload: {
          type: "highlight",
          key: "highlight_id",
        },
      });
      expect(afterState2.__indices.highlight["arcId"]).toEqual({});
      expect(afterState2.__indices.highlight["entryKey"]).toEqual({});

      const afterState3 = reducer(afterState2, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "highlight",
          document: {
            id: "highlight_1_id",
            entryKey: "1/1/2020",
            arcId: "arc_1",
          },
        },
      });
      const afterState4 = reducer(afterState3, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "highlight",
          document: {
            id: "highlight_2_id",
            entryKey: "1/1/2020",
            arcId: "arc_2",
          },
        },
      });
      expect(afterState4.__indices.highlight["arcId"]).toEqual({
        arc_1: ["highlight_1_id"],
        arc_2: ["highlight_2_id"],
      });
      expect(afterState4.__indices.highlight["entryKey"]).toEqual({
        "1/1/2020": ["highlight_1_id", "highlight_2_id"],
      });

      const afterState5 = reducer(afterState4, {
        type: "REMOVE_DOCUMENTS",
        payload: {
          type: "highlight",
          keys: ["highlight_1_id", "highlight_2_id"],
        },
      });
      expect(afterState5.__indices.highlight["arcId"]).toEqual({});
      expect(afterState5.__indices.highlight["entryKey"]).toEqual({});
    });
  });
});
