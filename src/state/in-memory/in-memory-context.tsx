import React, { useCallback, useEffect, useReducer, useState } from "react";
import { IpsumIndexedDBClient, useIpsumIDBWrapper } from "util/indexed-db";
import {
  Document,
  CollectionName,
  CollectionSchema,
  InMemorySchema,
  InMemoryState,
  TopLevelFieldName,
  TopLevelField,
  Collection,
  getPrimaryKey,
} from "./in-memory-schema";
import {
  deserializeInMemoryState,
  initializeDefaultInMemoryState,
  serializeInMemoryState,
} from "./in-memory-state";
import _, { intersection } from "underscore";
import { dispatch, InMemoryAction } from "./in-memory-actions";
import { readFromFile, writeToFile } from "util/file/serializer";
import { usePrevious } from "util/hooks/usePrevious";

export const InMemoryStateProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }: { children: React.ReactElement }) => {
  const idbWrapper = useIpsumIDBWrapper();

  const [stateFromAutosave, setStateFromAutosave] = useState<
    InMemoryState | undefined
  >();
  useEffect(() => {
    if (idbWrapper !== undefined && stateFromAutosave === undefined) {
      idbWrapper.getNewInMemoryState().then((state) => {
        setStateFromAutosave(state);
      });
    }
  }, [idbWrapper, stateFromAutosave]);

  if (idbWrapper === undefined || stateFromAutosave === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <InMemoryStateProviderWithAutosave
        idbWrapper={idbWrapper}
        stateFromAutosave={stateFromAutosave}
      >
        {children}
      </InMemoryStateProviderWithAutosave>
    );
  }
};

export interface InMemoryStateContextType {
  state: InMemoryState;
  dispatch: React.Dispatch<InMemoryAction>;
  optimisticDispatch: (
    state: InMemoryState,
    action: InMemoryAction
  ) => InMemoryState;
  saveToFile: () => Promise<void>;
  loadFromFile: () => Promise<void>;
  resetToInitial: () => void;
  shouldReloadEditor: boolean;
  reloadEditor: () => void;
  hasLoadedAutosave: boolean;
  addDocumentBroadcaster: <T extends CollectionName>(
    broadcaster: DocumentBroadcaster<T>
  ) => void;
  removeDocumentBroadcaster: (id: string) => void;
  addFieldBroadcaster: <T extends TopLevelFieldName>(
    broadcaster: FieldBroadcaster<T>
  ) => void;
  removeFieldBroadcaster: (id: string) => void;
}

export const InMemoryStateContext =
  React.createContext<InMemoryStateContextType>({
    state: {} as InMemoryState,
    dispatch: () => {},
    optimisticDispatch: () => initializeDefaultInMemoryState(),
    saveToFile: async () => {},
    loadFromFile: async () => {},
    resetToInitial: () => {},
    shouldReloadEditor: false,
    reloadEditor: () => {},
    hasLoadedAutosave: false,
    addDocumentBroadcaster: () => {},
    removeDocumentBroadcaster: () => {},
    addFieldBroadcaster: () => {},
    removeFieldBroadcaster: () => {},
  });

export const reducer = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  const newState = dispatch(state, action);
  return newState;
};

export interface FieldBroadcaster<F extends TopLevelFieldName> {
  type: "field";
  id: string;
  field: F;
  broadcast: (field: TopLevelField<F>) => void;
}

export interface DocumentBroadcaster<C extends CollectionName> {
  type: "documents";
  id: string;
  name?: string;
  collection: C;
  keys?: CollectionSchema[C]["primaryKey"][];
  broadcast: (documents: { [k: string]: Document<C> }) => void;
}

export const InMemoryStateProviderWithAutosave: React.FC<{
  children: React.ReactElement;
  idbWrapper: IpsumIndexedDBClient;
  stateFromAutosave: InMemoryState;
}> = ({ children, idbWrapper, stateFromAutosave }) => {
  const [state, dispatch] = useReducer(reducer, stateFromAutosave);

  const optimisticDispatch = useCallback(
    (state: InMemoryState, action: InMemoryAction) => {
      return reducer(state, action);
    },
    []
  );

  // Every query a component makes for documents is stored in state so we know
  // where to send updates when those document objects are updated.
  const [documentBroadcasters, setDocumentBroadcasters] = useState<
    DocumentBroadcaster<CollectionName>[]
  >([]);
  const addDocumentBroadcaster = useCallback(
    <T extends CollectionName>(broadcaster: DocumentBroadcaster<T>) => {
      if (!documentBroadcasters.find((db) => db.id === broadcaster.id)) {
        setDocumentBroadcasters((dbs) => dbs.concat(broadcaster));
      }
    },
    [documentBroadcasters, setDocumentBroadcasters]
  );
  const removeDocumentBroadcaster = useCallback(
    (id: string) => {
      if (documentBroadcasters.find((db) => db.id === id)) {
        setDocumentBroadcasters((dbs) => dbs.filter((b) => b.id !== id));
      }
    },
    [documentBroadcasters]
  );

  // See above, but with fields instead of documents.
  const [fieldBroadcasters, setFieldBroadcasters] = useState<
    FieldBroadcaster<TopLevelFieldName>[]
  >([]);
  const addFieldBroadcaster = useCallback(
    <T extends TopLevelFieldName>(broadcaster: FieldBroadcaster<T>) => {
      if (!fieldBroadcasters.find((fb) => fb.id === broadcaster.id))
        setFieldBroadcasters([...fieldBroadcasters, broadcaster]);
    },
    [fieldBroadcasters]
  );
  const removeFieldBroadcaster = useCallback(
    (id: string) => {
      if (fieldBroadcasters.find((fb) => fb.id === id))
        setFieldBroadcasters(fieldBroadcasters.filter((b) => b.id !== id));
    },
    [fieldBroadcasters]
  );

  // Listens to changes in state and broadcasts only appropriate changes. Note
  // this doesn't provide the initial result of a state query, just updates to
  // that query when the state changes.
  const prevState = usePrevious(state);
  useEffect(() => {
    if (!state) return;
    Object.keys(InMemorySchema).forEach((key: keyof typeof InMemorySchema) => {
      // If a top-level field or collection called key has changed.
      if (!_.isEqual(prevState?.[key], state[key])) {
        // Broadcast field changes.
        if (InMemorySchema[key].__type === "field") {
          fieldBroadcasters.forEach((fb) => {
            if (fb.type === "field" && fb.field === key) {
              (fb as FieldBroadcaster<typeof key>).broadcast(state[key]);
            }
          });
        }
        // Broadcast collection changes.
        if (InMemorySchema[key].__type === "document") {
          const changedDocumentKeys = Object.keys(state[key]).filter(
            (docKey: keyof typeof state[typeof key]) => {
              return !_.isEqual(state[key][docKey], prevState?.[key][docKey]);
            }
          );
          documentBroadcasters.forEach((db) => {
            if (
              db.type === "documents" &&
              db.collection === key &&
              // keys is undefined for whole collection query, otherwise only
              // brodcast when at least one specified document is changed.
              (!db.keys || intersection(db.keys, changedDocumentKeys).length)
            ) {
              const selectedCollection = state[db.collection] as Collection<
                typeof key
              >;
              const filteredDocuments = Object.keys(selectedCollection)
                .filter((docKey) => !db.keys || db.keys.includes(docKey))
                .map((docKey) => selectedCollection[docKey]);
              const primaryKey = getPrimaryKey(db.collection);
              const mappedFilteredDocuments = filteredDocuments.reduce(
                (acc, cur) => {
                  return {
                    ...acc,
                    [cur[primaryKey as keyof typeof cur]]: cur,
                  };
                },
                {}
              );
              (db as DocumentBroadcaster<typeof key>).broadcast(
                mappedFilteredDocuments
              );
            }
          });
        }
      }
    });
  }, [documentBroadcasters, fieldBroadcasters, prevState, state]);

  const [hasLoadedAutosave, setHasLoadedAutosave] = useState(false);
  useEffect(() => {
    if (stateFromAutosave && !hasLoadedAutosave) {
      dispatch({ type: "OVERWRITE", payload: { newState: stateFromAutosave } });
      setHasLoadedAutosave(true);
    }
  }, [idbWrapper, hasLoadedAutosave, stateFromAutosave]);

  const [shouldReloadEditor, setReloadEditor] = useState(false);
  useEffect(() => {
    if (shouldReloadEditor === true) setReloadEditor(false);
  }, [shouldReloadEditor]);

  const autosave = useCallback(() => {
    localStorage.setItem("ipsum-autosave-id", state.journalId);
    idbWrapper.putNewInMemoryState(state);
  }, [idbWrapper, state]);

  const autosaveDebounced = useCallback(_.debounce(autosave, 1500), [state]);

  // TODO This will autosave every time any part of the state changes, which
  // maybe we don't want.
  useEffect(() => {
    autosaveDebounced();
  }, [autosaveDebounced, state]);

  const saveToFile = useCallback(async () => {
    await writeToFile(serializeInMemoryState(state), {
      excludeAcceptAllOption: true,
      suggestedName: `${state.journalTitle}.ipsum`,
      types: [
        { description: "Ipsum Files", accept: { "text/plain": [".ipsum"] } },
      ],
    });
  }, [state]);

  const loadFromFile = useCallback(async () => {
    const state = await readFromFile({
      excludeAcceptAllOption: true,
      multiple: false,
      types: [
        {
          description: "Ipsum Files",
          accept: { "text/plain": [".ipsum"] },
        },
      ],
    });
    dispatch({
      type: "OVERWRITE",
      payload: {
        newState: deserializeInMemoryState(state),
      },
    });
    setReloadEditor(true);
  }, []);

  const resetToInitial = useCallback(() => {
    dispatch({
      type: "OVERWRITE",
      payload: { newState: initializeDefaultInMemoryState() },
    });
    setReloadEditor(true);
  }, []);

  return (
    <InMemoryStateContext.Provider
      value={{
        state,
        dispatch,
        optimisticDispatch,
        saveToFile,
        loadFromFile,
        resetToInitial,
        shouldReloadEditor,
        reloadEditor: () => {
          setReloadEditor(true);
        },
        hasLoadedAutosave,
        addDocumentBroadcaster,
        removeDocumentBroadcaster,
        addFieldBroadcaster,
        removeFieldBroadcaster,
      }}
    >
      {state ? children : <div>Loading...</div>}
    </InMemoryStateContext.Provider>
  );
};
