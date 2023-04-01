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
import {
  createAllIndices,
  indicesForCreatedDocuments,
  indicesForRemovedDocuments,
  indicesForUpdatedDocuments,
} from "./indices";

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
    const stateCopy = createAllIndices(deepClone(payload.newState));
    return stateCopy;
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

    const newDoc = {
      ...defaultDocument,
      ...payload.document,
    };

    const newColIndices = indicesForCreatedDocuments(
      payload.type,
      state.__indices[payload.type],
      [newDoc]
    );

    stateCopy[payload.type][newDocumentKey] = newDoc;
    return {
      ...stateCopy,
      __indices: { ...stateCopy.__indices, [payload.type]: newColIndices },
    };
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

    const oldDoc = { ...stateCopy[payload.type][payload.key] };
    const updatedDoc = {
      ...stateCopy[payload.type][payload.key],
      ...payload.update,
    };

    const newColIndices = indicesForUpdatedDocuments(
      payload.type,
      state.__indices[payload.type],
      [oldDoc],
      [updatedDoc]
    );

    stateCopy[payload.type][payload.key] = updatedDoc;

    return {
      ...stateCopy,
      __indices: { ...stateCopy.__indices, [payload.type]: newColIndices },
    };
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
    const stateCopy: WritableInMemoryState = deepClone(state);
    const removedDoc = state[payload.type][payload.key];
    delete stateCopy[payload.type][payload.key];
    const newColIndices = indicesForRemovedDocuments(
      payload.type,
      state.__indices[payload.type],
      [removedDoc]
    );
    return {
      ...stateCopy,
      __indices: { ...stateCopy.__indices, [payload.type]: newColIndices },
    };
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
    const stateCopy: WritableInMemoryState = deepClone(state);
    const removedDocs = payload.keys.map((key) => state[payload.type][key]);
    payload.keys.forEach((key) => {
      delete stateCopy[payload.type][key];
    });
    const newColIndices = indicesForRemovedDocuments(
      payload.type,
      stateCopy.__indices[payload.type],
      removedDocs
    );
    return {
      ...stateCopy,
      __indices: { ...stateCopy.__indices, [payload.type]: newColIndices },
    };
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
