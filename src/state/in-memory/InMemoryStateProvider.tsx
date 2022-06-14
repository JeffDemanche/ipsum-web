import React, { useEffect, useReducer, useState } from "react";
import { dexieIpsumSchema } from "state/DexieIpsumSchema";
import { InMemoryAction } from "./in-memory-actions";
import {
  initialInMemoryState,
  InMemoryState,
  reducer,
} from "./in-memory-state";

export interface InMemoryStateContextType {
  state: InMemoryState;
  dispatch: React.Dispatch<InMemoryAction>;

  loadedFromDexie: boolean;
}

export const InMemoryStateContext =
  React.createContext<InMemoryStateContextType>({
    state: initialInMemoryState,
    dispatch: () => {},
    loadedFromDexie: false,
  });

export const InMemoryStateProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }: { children: React.ReactElement }) => {
  // could be adjusted to be "which" dexie instance to use.
  const [loadedFromDexie, setLoadedFromDexie] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialInMemoryState);

  useEffect(() => {
    dexieIpsumSchema.loadInMemoryState().then((state) => {
      dispatch({ type: "OVERRIDE-FROM-DEXIE", payload: { state } });
      setLoadedFromDexie(true);
    });
  }, []);

  return (
    <InMemoryStateContext.Provider value={{ state, dispatch, loadedFromDexie }}>
      {loadedFromDexie ? children : <div>Loading...</div>}
    </InMemoryStateContext.Provider>
  );
};
