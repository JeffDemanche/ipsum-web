import React, { useCallback, useEffect, useState } from "react";
import { readFromFile, writeToFile } from "util/file";
import { useIpsumIDBWrapper } from "util/indexed-db";
import { initializeState, vars } from "./client";
import { loadApolloState, writeApolloState } from "./serializer";

interface ApolloSerialization {
  saveToFile: () => Promise<void>;
  loadFromFile: () => Promise<void>;
  resetToInitial: () => void;
  hasLoadedAutosave: boolean;
  loadErrors: string[] | undefined;
}

export const ApolloSerializationContext =
  React.createContext<ApolloSerialization>({
    saveToFile: async () => {},
    loadFromFile: async () => {},
    resetToInitial: () => {},
    hasLoadedAutosave: false,
    loadErrors: undefined,
  });

/**
 * A wrapper that 1. reads from IDB autosave data and 2. handles loading and
 * saving Apollo state to file.
 */
export const ApolloSerializationProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const saveToFile = useCallback(async () => {
    await writeToFile(writeApolloState(), {
      excludeAcceptAllOption: true,
      suggestedName: `${vars.journalTitle()}.ipsum`,
      types: [
        { description: "Ipsum Files", accept: { "text/plain": [".ipsum"] } },
      ],
    });
  }, []);

  const [loadErrors, setLoadErrors] = useState<string[] | undefined>(undefined);

  console.log(loadErrors);

  const loadFromFile = useCallback(async () => {
    setLoadErrors(
      loadApolloState(
        await readFromFile({
          excludeAcceptAllOption: true,
          multiple: false,
          types: [
            {
              description: "Ipsum Files",
              accept: { "text/plain": [".ipsum"] },
            },
          ],
        })
      )
    );
  }, []);

  const resetToInitial = useCallback(() => {
    initializeState();
  }, []);

  // Autosave stuff
  const idbWrapper = useIpsumIDBWrapper();

  const [stateFromAutosave, setStateFromAutosave] = useState<
    string | undefined
  >();
  useEffect(() => {
    if (idbWrapper !== undefined && stateFromAutosave === undefined) {
      idbWrapper.getAutosaveValue().then((state) => {
        setStateFromAutosave(state);
      });
    }
  }, [idbWrapper, stateFromAutosave]);

  const [hasLoadedAutosave, setHasLoadedAutosave] = useState(false);
  useEffect(() => {
    if (stateFromAutosave && !hasLoadedAutosave) {
      setLoadErrors(loadApolloState(stateFromAutosave));
      setHasLoadedAutosave(true);
    }
  }, [idbWrapper, hasLoadedAutosave, stateFromAutosave]);

  return (
    <ApolloSerializationContext.Provider
      value={{
        saveToFile,
        loadFromFile,
        resetToInitial,
        hasLoadedAutosave,
        loadErrors,
      }}
    >
      {children}
    </ApolloSerializationContext.Provider>
  );
};
