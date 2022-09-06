import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import _ from "underscore";
import {
  readFileToInMemoryState,
  writeInMemoryStateToFile,
} from "util/file/serializer";
import { IpsumIndexedDBClient, useIpsumIDBWrapper } from "util/indexed-db";
import { InMemoryAction } from "./in-memory-actions";
import {
  initialInMemoryState,
  InMemoryState,
  reducer,
} from "./in-memory-state";

export interface InMemoryStateContextType {
  state: InMemoryState;
  dispatch: React.Dispatch<InMemoryAction>;
  saveToFile: () => Promise<void>;
  loadFromFile: () => Promise<void>;
  shouldReloadEditor: boolean;
  reloadEditor: () => void;
}

export const InMemoryStateContext =
  React.createContext<InMemoryStateContextType>({
    state: initialInMemoryState,
    dispatch: () => {},
    saveToFile: async () => {},
    loadFromFile: async () => {},
    shouldReloadEditor: false,
    reloadEditor: () => {},
  });

export const InMemoryStateProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }: { children: React.ReactElement }) => {
  const idbWrapper = useIpsumIDBWrapper();

  const [stateFromAutosave, setStateFromAutosave] = useState<
    InMemoryState | undefined
  >(undefined);
  useEffect(() => {
    if (idbWrapper !== undefined && stateFromAutosave === undefined)
      idbWrapper.getInMemoryState().then((state) => {
        setStateFromAutosave(state);
      });
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

const InMemoryStateProviderWithAutosave: React.FC<{
  children: React.ReactElement;
  idbWrapper: IpsumIndexedDBClient;
  stateFromAutosave: InMemoryState;
}> = ({ children, idbWrapper, stateFromAutosave }) => {
  const [state, dispatch] = useReducer(reducer, stateFromAutosave);

  const hasLoadedAutosave = useRef(false);
  useEffect(() => {
    if (stateFromAutosave && !hasLoadedAutosave.current) {
      dispatch({ type: "OVERRIDE", payload: { state: stateFromAutosave } });
      hasLoadedAutosave.current = true;
    }
  }, [idbWrapper, stateFromAutosave]);

  const [shouldReloadEditor, setReloadEditor] = useState(false);
  useEffect(() => {
    if (shouldReloadEditor === true) setReloadEditor(false);
  }, [shouldReloadEditor]);

  const autosave = useCallback(() => {
    localStorage.setItem("ipsum-autosave-id", state.journalId);
    idbWrapper.putInMemoryState(state);
  }, [idbWrapper, state]);

  const autosaveDebounced = useCallback(_.debounce(autosave, 1500), [state]);

  // TODO This will autosave every time any part of the state changes, which
  // maybe we don't want.
  useEffect(() => {
    autosaveDebounced();
  }, [autosaveDebounced, state]);

  const saveToFile = useCallback(async () => {
    await writeInMemoryStateToFile(state);
  }, [state]);

  const loadFromFile = useCallback(async () => {
    dispatch({
      type: "OVERRIDE",
      payload: { state: await readFileToInMemoryState() },
    });
    setReloadEditor(true);
  }, []);

  return (
    <InMemoryStateContext.Provider
      value={{
        state,
        dispatch,

        saveToFile,
        loadFromFile,
        shouldReloadEditor,
        reloadEditor: () => {
          setReloadEditor(true);
        },
      }}
    >
      {state ? children : <div>Loading...</div>}
    </InMemoryStateContext.Provider>
  );
};
