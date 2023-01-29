import { ContentState } from "draft-js";
import { parseContentState, stringifyContentState } from "util/content-state";
import { WritableInMemoryState } from "../in-memory-schema";
import {
  deserializeInMemoryState,
  initializeDefaultDocument,
  initializeDefaultInMemoryState,
  serializeInMemoryState,
} from "../in-memory-state";

describe("InMemoryState", () => {
  describe("initializeDefaultInMemoryState", () => {
    it("includes empty documents and fields", () => {
      const state = initializeDefaultInMemoryState();

      expect(state.entry).toEqual({});
      expect(state.arc).toEqual({});
      expect(state.arc_assignment).toEqual({});
      expect(state.journalMetadata).toEqual({
        lastArcHue: 0,
      });
      expect(state.journalTitle).toEqual("new journal");
    });
  });

  describe("serialization", () => {
    it("serializes and deserializes an empty state", () => {
      const defaultState = initializeDefaultInMemoryState();
      const serialized = serializeInMemoryState(defaultState);
      const deserialized = deserializeInMemoryState(serialized);
      expect(deserialized).toEqual(defaultState);
    });

    it("serializes an entry's date field and content state (custom serializers)", () => {
      const entry = { ...initializeDefaultDocument("entry") };
      const state = {
        ...initializeDefaultInMemoryState(),
        entry: { [entry.entryKey]: entry },
      };
      const serialized = serializeInMemoryState(state);
      const deserialized = deserializeInMemoryState(serialized);
      expect(deserialized).toEqual(state);
      expect(JSON.stringify(deserialized.entry[entry.entryKey].date)).toEqual(
        JSON.stringify(entry.date)
      );
      expect(
        parseContentState(
          deserialized.entry[entry.entryKey].contentState
        ).getPlainText()
      ).toEqual(parseContentState(entry.contentState).getPlainText());
    });

    it("serializes multiple arcs", () => {
      const arc1 = { ...initializeDefaultDocument("arc") };
      const arc2 = { ...initializeDefaultDocument("arc") };
      const state = {
        ...initializeDefaultInMemoryState(),
        arc: { [arc1.id]: arc1, [arc2.id]: arc2 },
      };
      const serialized = serializeInMemoryState(state);
      const deserialized = deserializeInMemoryState(serialized);
      expect(deserialized).toEqual(state);
    });

    it("adds default value for when a collection doesn't exist in file", () => {
      const state: WritableInMemoryState = initializeDefaultInMemoryState();
      delete state.arc;
      delete state.arc_assignment;
      const serialized = serializeInMemoryState(state);
      const deserialized = deserializeInMemoryState(serialized);
      expect(deserialized.arc).toEqual({});
      expect(deserialized.arc_assignment).toEqual({});
    });

    it("serializes state with multiple settings", () => {
      const entry1 = {
        ...initializeDefaultDocument("entry"),
        contentState: stringifyContentState(
          ContentState.createFromText("entry 1 text")
        ),
      };
      const entry2 = {
        ...initializeDefaultDocument("entry"),
        contentState: stringifyContentState(
          ContentState.createFromText("entry 2 text")
        ),
      };
      const arc = {
        ...initializeDefaultDocument("arc"),
      };
      const arcAssignment1 = {
        ...initializeDefaultDocument("arc_assignment"),
        arcId: arc.id,
        entryKey: entry1.entryKey,
      };
      const arcAssignment2 = {
        ...initializeDefaultDocument("arc_assignment"),
        arcId: arc.id,
        entryKey: entry2.entryKey,
      };
      const state = {
        ...initializeDefaultInMemoryState(),
        entry: { [entry1.entryKey]: entry1, [entry2.entryKey]: entry2 },
        arc: { [arc.id]: arc },
        arc_assignment: {
          [arcAssignment1.id]: arcAssignment1,
          [arcAssignment2.id]: arcAssignment2,
        },
        journalTitle: "buddy buddy buddy",
      };
      const serialized = serializeInMemoryState(state);
      const deserialized = deserializeInMemoryState(serialized);
      expect(deserialized.journalTitle).toEqual(state.journalTitle);
      expect(deserialized.journalId).toEqual(state.journalId);
      expect(deserialized.arc).toEqual(state.arc);
      expect(deserialized.arc_assignment).toEqual(state.arc_assignment);
      expect(
        parseContentState(
          deserialized.entry[entry1.entryKey].contentState
        ).getPlainText()
      ).toEqual(
        parseContentState(
          state.entry[entry1.entryKey].contentState
        ).getPlainText()
      );
      expect(
        parseContentState(
          deserialized.entry[entry2.entryKey].contentState
        ).getPlainText()
      ).toEqual(
        parseContentState(
          state.entry[entry2.entryKey].contentState
        ).getPlainText()
      );
    });
  });
});
