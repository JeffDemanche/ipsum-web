import React, { createContext, useCallback, useEffect, useState } from "react";
import { useIpsumIDBWrapper } from "util/indexed-db";
import {
  loadApolloState,
  readFromFile,
  writeApolloState,
  writeToFile,
} from "util/serializer";
import { useModifySearchParams } from "util/state";

import { initializeState, vars } from "../apollo/client";
import { autosave } from "./autosave";

interface ApolloSerialization {
  saveToFile: () => Promise<void>;
  loadFromFile: () => Promise<void>;
  resetToInitial: () => void;
  hasLoadedAutosave: boolean;
  loadErrors: string[] | undefined;
}

export const ApolloSerializationContext = createContext<ApolloSerialization>({
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

  useEffect(() => {
    if (loadErrors) {
      console.error(loadErrors);
    }
  }, [loadErrors]);

  const modifySearchParams = useModifySearchParams();

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
    modifySearchParams(() => ({}));
    autosave();
  }, [modifySearchParams]);

  const [resetting, setResetting] = useState(false);
  const resetToInitial = useCallback(async () => {
    setResetting(true);
    modifySearchParams(() => ({}));
    await initializeState();
    autosave();
    refreshDom();
    setResetting(false);
  }, [modifySearchParams, refreshDom]);

  // Autosave stuff
  const idbWrapper = useIpsumIDBWrapper();

  const [stateFromAutosave, setStateFromAutosave] = useState<
    string | undefined
  >();
  useEffect(() => {
    if (idbWrapper !== undefined && stateFromAutosave === undefined) {
      idbWrapper.getAutosaveValue().then((state) => {
        if (!state) {
          initializeState().then(() => {
            setHasLoadedAutosave(true);
          });
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

  const dom = (() => {
    if (resetting) {
      return <p>resetting...</p>;
    } else if (hasLoadedAutosave) {
      return children;
    } else {
      return <p>loading autosave...</p>;
    }
  })();

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
      {dom}
    </ApolloSerializationContext.Provider>
  );
};
