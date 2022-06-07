import { dexieIpsumSchema } from "state/DexieIpsumSchema";
import { IpsumDateTime } from "util/dates";
import { InMemoryState } from "./in-memory-state";

export type InMemoryAction =
  | {
      type: "OVERRIDE-FROM-DEXIE";
      payload: Parameters<typeof dispatchers["OVERRIDE-FROM-DEXIE"]>["1"];
    }
  | {
      type: "CREATE-OR-UPDATE-ENTRY";
      payload: Parameters<typeof dispatchers["CREATE-OR-UPDATE-ENTRY"]>["1"];
    }
  | {
      type: "DELETE-ENTRY";
      payload: Parameters<typeof dispatchers["DELETE-ENTRY"]>["1"];
    };

export type InMemoryActionType = InMemoryAction["type"];

const dispatchers = {
  "OVERRIDE-FROM-DEXIE": (
    state: InMemoryState,
    payload: { state: InMemoryState }
  ) => {
    return payload.state;
  },
  "CREATE-OR-UPDATE-ENTRY": (
    state: InMemoryState,
    payload: { entryKey: string; date: IpsumDateTime; contentState: string }
  ): InMemoryState => {
    dexieIpsumSchema.getEntry(payload.entryKey).then((entry) => {
      if (entry) {
        dexieIpsumSchema.updateEntry({
          entryKey: payload.entryKey,
          contentState: payload.contentState,
        });
      } else {
        dexieIpsumSchema.createEntry({
          entryKey: payload.entryKey,
          date: payload.date.dateTime.toJSDate(),
          contentState: payload.contentState,
        });
      }
    });
    return {
      ...state,
      entries: {
        ...state.entries,
        [payload.entryKey]: {
          ...payload,
        },
      },
    };
  },
  "DELETE-ENTRY": (
    state: InMemoryState,
    payload: { entryKey: string }
  ): InMemoryState => {
    const copy = { ...state };
    delete copy.entries[payload.entryKey];
    return copy;
  },
};

export const dispatch = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  switch (action.type) {
    case "OVERRIDE-FROM-DEXIE":
      return dispatchers[action.type](state, action.payload);
    case "CREATE-OR-UPDATE-ENTRY":
      return dispatchers[action.type](state, action.payload);
    case "DELETE-ENTRY":
      return dispatchers[action.type](state, action.payload);
    default:
      return { ...state };
  }
};
