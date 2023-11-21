import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { readFromFile, writeToFile } from "util/file";
import { useIpsumIDBWrapper } from "util/indexed-db";
import { autosave } from "./autosave";
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

  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const refreshDom = useCallback(() => {
    setRefreshTrigger(true);
  }, []);
  useEffect(() => {
    if (refreshTrigger) setRefreshTrigger(false);
  }, [refreshTrigger]);

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
    autosave();
    refreshDom();
  }, [refreshDom]);

  const navigate = useNavigate();

  const resetToInitial = useCallback(() => {
    navigate({ search: "" });
    initializeState();
    autosave();
    refreshDom();
  }, [navigate, refreshDom]);

  // Autosave stuff
  const idbWrapper = useIpsumIDBWrapper();

  const [stateFromAutosave, setStateFromAutosave] = useState<
    string | undefined
  >();
  useEffect(() => {
    if (idbWrapper !== undefined && stateFromAutosave === undefined) {
      idbWrapper.getAutosaveValue().then((state) => {
        if (!state) {
          initializeState();
          setHasLoadedAutosave(true);
        } else {
          setStateFromAutosave(state);
        }
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
      {hasLoadedAutosave ? (
        refreshTrigger ? (
          <></>
        ) : (
          children
        )
      ) : (
        <p>loading autosave...</p>
      )}
    </ApolloSerializationContext.Provider>
  );
};
