import React, { useCallback, useReducer } from "react";
import {
  readFileToInMemoryState,
  writeInMemoryStateToFile,
} from "util/file/serializer";
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
}

export const InMemoryStateContext =
  React.createContext<InMemoryStateContextType>({
    state: initialInMemoryState,
    dispatch: () => {},
    saveToFile: async () => {},
    loadFromFile: async () => {},
  });

export const InMemoryStateProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(reducer, initialInMemoryState);

  const saveToFile = useCallback(async () => {
    await writeInMemoryStateToFile(state);
  }, [state]);

  const loadFromFile = useCallback(async () => {
    dispatch({
      type: "OVERRIDE",
      payload: { state: await readFileToInMemoryState() },
    });
  }, []);

  return (
    <InMemoryStateContext.Provider
      value={{ state, dispatch, saveToFile, loadFromFile }}
    >
      {state ? children : <div>Loading...</div>}
    </InMemoryStateContext.Provider>
  );
};
