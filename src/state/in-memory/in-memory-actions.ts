import { deepClone } from "util/deep-clone";
import {
  Document,
  CollectionName,
  InMemorySchema,
  InMemoryState,
  Collection,
  getPrimaryKey,
  WritableInMemoryState,
  TopLevelFieldName,
  TopLevelField,
} from "./in-memory-schema";
import { initializeDefaultDocument } from "./in-memory-state";

export type InMemoryAction =
  | {
      type: "OVERWRITE";
      payload: Parameters<typeof dispatchers["OVERWRITE"]>[1];
    }
  | {
      type: "CREATE_DOCUMENT";
      payload: Parameters<typeof dispatchers["CREATE_DOCUMENT"]>[1];
    }
  | {
      type: "UPDATE_FIELD";
      payload: Parameters<typeof dispatchers["UPDATE_FIELD"]>[1];
    }
  | {
      type: "UPDATE_DOCUMENT";
      payload: Parameters<typeof dispatchers["UPDATE_DOCUMENT"]>[1];
    }
  | {
      type: "REMOVE_DOCUMENT";
      payload: Parameters<typeof dispatchers["REMOVE_DOCUMENT"]>[1];
    }
  | {
      type: "REMOVE_DOCUMENTS";
      payload: Parameters<typeof dispatchers["REMOVE_DOCUMENTS"]>[1];
    };

const dispatchers = {
  OVERWRITE: (
    state: InMemoryState,
    payload: {
      newState: InMemoryState;
    }
  ): InMemoryState => {
    return payload.newState;
  },
  CREATE_DOCUMENT: (
    state: InMemoryState,
    payload: {
      [C in CollectionName]: {
        type: C;
        document: Partial<Document<C>>;
      };
    }[CollectionName]
  ): InMemoryState => {
    const stateCopy = deepClone(state);
    const collection = stateCopy[payload.type] as Collection<
      typeof payload["type"]
    >;
    const primaryKey = getPrimaryKey(
      payload.type
    ) as typeof InMemorySchema[typeof payload["type"]]["primaryKey"];

    if (
      Object.keys(collection).includes(
        (payload.document as { [primaryKey: string]: any })[primaryKey]
      )
    )
      throw new Error(
        `CREATE_DOCUMENT: ${payload.type} with key ${primaryKey} already exists`
      );

    const defaultDocument = initializeDefaultDocument(payload.type);
    const newDocumentKey =
      payload.document[primaryKey as keyof typeof payload.document] ??
      defaultDocument[primaryKey as keyof typeof defaultDocument];
    (stateCopy[payload.type] as Collection<typeof payload["type"]>)[
      newDocumentKey
    ] = {
      ...defaultDocument,
      ...payload.document,
    };
    return stateCopy;
  },
  UPDATE_FIELD: (
    state: InMemoryState,
    payload: {
      [F in TopLevelFieldName]: { field: F; update: TopLevelField<F> };
    }[TopLevelFieldName]
  ) => {
    const stateCopy: WritableInMemoryState = deepClone(state);
    (stateCopy[payload.field] as TopLevelField<TopLevelFieldName>) =
      payload.update;
    return stateCopy;
  },
  UPDATE_DOCUMENT: (
    state: InMemoryState,
    payload: {
      [C in CollectionName]: {
        type: C;
        key: typeof InMemorySchema[C]["primaryKey"];
        update: Partial<Document<C>>;
      };
    }[CollectionName]
  ): InMemoryState => {
    const stateCopy: WritableInMemoryState = deepClone(state);
    if (!stateCopy[payload.type][payload.key]) {
      throw new Error(
        `UPDATE_DOCUMENT: couldn't find ${payload.type} with key ${payload.key}`
      );
    }
    if (Object.keys(payload.update).includes(getPrimaryKey(payload.type))) {
      throw new Error(
        `UPDATE_DOCUMENT: can't set primary key value in document update for ${payload.type}`
      );
    }
    stateCopy[payload.type][payload.key] = {
      ...stateCopy[payload.type][payload.key],
      ...payload.update,
    };
    return stateCopy;
  },
  REMOVE_DOCUMENT: (
    state: InMemoryState,
    payload: {
      [C in CollectionName]: {
        type: C;
        key: typeof InMemorySchema[C]["primaryKey"];
      };
    }[CollectionName]
  ): InMemoryState => {
    const stateCopy: WritableInMemoryState = { ...state };
    delete stateCopy[payload.type][payload.key];
    return stateCopy;
  },
  REMOVE_DOCUMENTS: (
    state: InMemoryState,
    payload: {
      [C in CollectionName]: {
        type: C;
        keys: typeof InMemorySchema[C]["primaryKey"][];
      };
    }[CollectionName]
  ): InMemoryState => {
    const stateCopy: WritableInMemoryState = { ...state };
    payload.keys.forEach((key) => {
      delete stateCopy[payload.type][key];
    });
    return stateCopy;
  },
};

export const dispatch = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  switch (action.type) {
    case "OVERWRITE":
      return dispatchers[action.type](state, action.payload);
    case "CREATE_DOCUMENT":
      return dispatchers[action.type](state, action.payload);
    case "UPDATE_FIELD":
      return dispatchers[action.type](state, action.payload);
    case "UPDATE_DOCUMENT":
      return dispatchers[action.type](state, action.payload);
    case "REMOVE_DOCUMENT":
      return dispatchers[action.type](state, action.payload);
    case "REMOVE_DOCUMENTS":
      return dispatchers[action.type](state, action.payload);
    default:
      return { ...state };
  }
};
