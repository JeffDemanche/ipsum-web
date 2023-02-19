import React from "react";
import { InMemoryAction } from "../in-memory-actions";
import { InMemoryStateContext } from "../in-memory-context";
import { InMemoryState } from "../in-memory-schema";
import { initializeDefaultInMemoryState } from "../in-memory-state";

interface MockInMemoryStateProviderProps {
  state?: Partial<InMemoryState>;
  dispatch?: React.Dispatch<InMemoryAction>;
  optimisticDispatch?: (
    state: InMemoryState,
    action: InMemoryAction
  ) => InMemoryState;
  saveToFile?: () => Promise<void>;
  loadFromFile?: () => Promise<void>;
  resetToInitial?: () => void;
  hasLoadedAutosave?: boolean;
  children: React.ReactNode;
}

export const MockInMemoryStateProvider: React.FunctionComponent<
  MockInMemoryStateProviderProps
> = ({
  state,
  dispatch,
  optimisticDispatch,
  saveToFile,
  loadFromFile,
  resetToInitial,
  hasLoadedAutosave,
  children,
}) => {
  const filledInState = { ...initializeDefaultInMemoryState(), ...state };

  return (
    <InMemoryStateContext.Provider
      value={{
        state: filledInState,
        dispatch,
        optimisticDispatch,
        saveToFile,
        loadFromFile,
        resetToInitial,
        hasLoadedAutosave,
        addDocumentBroadcaster: () => {},
        removeDocumentBroadcaster: () => {},
        addFieldBroadcaster: () => {},
        removeFieldBroadcaster: () => {},
      }}
    >
      {children}
    </InMemoryStateContext.Provider>
  );
};
