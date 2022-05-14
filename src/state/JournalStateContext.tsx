import React, { useState } from "react";
import { DexieIpsumSchema } from "./DexieIpsumSchema";
import { InMemoryJournal } from "./JournalState.types";

export const emptyJournalState: InMemoryJournal = {
  loadedEntries: [],
};

export const JournalStateContext =
  React.createContext<InMemoryJournal>(emptyJournalState);

interface JournalStateProviderProps {
  children: React.ReactChild;
}

export const JournalStateProvider: React.FC<JournalStateProviderProps> = ({
  children,
}: JournalStateProviderProps) => {
  const [dexieIpsumSchema] = useState(new DexieIpsumSchema());

  const [loadedEntries, setLoadedEntries] = useState([]);

  return (
    <JournalStateContext.Provider value={{ loadedEntries }}>
      {children}
    </JournalStateContext.Provider>
  );
};
