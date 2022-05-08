import React, { useState } from "react";
import { emptyJournalState, JournalState } from "./JournalState";
import { JournalStateIndexedDB } from "./JournalStateIndexedDB";

const JournalStateContext = React.createContext(emptyJournalState);

interface JournalStateContextProps {
  stateStrategy: "LOCAL-STORAGE";
  children: React.ReactChild;
}

export const JournalStateProvider: React.FC<JournalState> = ({
  children,
}: JournalStateContextProps) => {
  // TODO to implement a server-side state, we would call the setter on this
  // with a different implementation of JournalState.
  const [journalState] = useState(new JournalStateIndexedDB());

  return (
    <JournalStateContext.Provider value={journalState}>
      {children}
    </JournalStateContext.Provider>
  );
};
