import React from "react";
import { InMemoryAction } from "../SCH_in-memory-actions";
import { InMemoryStateContext } from "../SCH_in-memory-context";
import { InMemoryState } from "../SCH_in-memory-schema";
import { initializeDefaultInMemoryState } from "../SCH_in-memory-state";

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
  shouldReloadEditor?: boolean;
  reloadEditor?: () => void;
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
  shouldReloadEditor,
  reloadEditor,
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
        shouldReloadEditor,
        reloadEditor,
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
