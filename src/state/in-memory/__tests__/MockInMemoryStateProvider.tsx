import React from "react";
import { InMemoryAction } from "../in-memory-actions";
import { initialInMemoryState, InMemoryState } from "../in-memory-state";
import { InMemoryStateContext } from "../InMemoryStateProvider";

interface MockInMemoryStateProviderProps {
  state?: Partial<InMemoryState>;
  dispatch?: React.Dispatch<InMemoryAction>;
  saveToFile?: () => Promise<void>;
  loadFromFile?: () => Promise<void>;
  shouldReloadEditor?: boolean;
  reloadEditor?: () => void;
  children: React.ReactNode;
}

export const MockInMemoryStateProvider: React.FunctionComponent<
  MockInMemoryStateProviderProps
> = ({
  state,
  dispatch,
  saveToFile,
  loadFromFile,
  shouldReloadEditor,
  reloadEditor,
  children,
}) => {
  const filledInState = { ...initialInMemoryState, ...state };

  return (
    <InMemoryStateContext.Provider
      value={{
        state: filledInState,
        dispatch,
        saveToFile,
        loadFromFile,
        shouldReloadEditor,
        reloadEditor,
      }}
    >
      {children}
    </InMemoryStateContext.Provider>
  );
};
