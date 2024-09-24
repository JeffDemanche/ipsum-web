import React, { createContext, useCallback, useEffect, useState } from "react";
import { useIpsumIDBWrapper } from "util/indexed-db";
import { readFromFile, writeToFile } from "util/serializer";
import { PROJECT_STATE, ProjectState, useModifySearchParams } from "util/state";

import { autosave } from "./autosave";

interface ApolloSerialization {
  saveToFile: () => Promise<void>;
  loadFromFile: () => Promise<void>;
  resetToInitial: () => void;
  hasLoadedAutosave: boolean;
}

export const SerializationContext = createContext<ApolloSerialization>({
  saveToFile: async () => {},
  loadFromFile: async () => {},
  resetToInitial: () => {},
  hasLoadedAutosave: false,
});

interface SerializationProviderProps {
  disabled: boolean;
  setProjectState: (projectState: ProjectState) => void;
  setProjectStateErrors: (errors: string[]) => void;
  children: React.ReactNode;
}

/**
 * A wrapper that 1. reads from IDB autosave data and 2. handles loading and
 * saving Apollo state to file.
 */
export const SerializationProvider: React.FunctionComponent<
  SerializationProviderProps
> = ({ disabled, setProjectState, setProjectStateErrors, children }) => {
  const saveToFile = async () => {
    await writeToFile(PROJECT_STATE.toSerialized(), {
      excludeAcceptAllOption: true,
      suggestedName: `${PROJECT_STATE.get("journalTitle")}.ipsum`,
      types: [
        { description: "Ipsum Files", accept: { "text/plain": [".ipsum"] } },
      ],
    });
  };

  const modifySearchParams = useModifySearchParams();

  const loadFromFile = useCallback(async () => {
    const fileString = await readFromFile({
      excludeAcceptAllOption: true,
      multiple: false,
      types: [
        {
          description: "Ipsum Files",
          accept: { "text/plain": [".ipsum"] },
        },
      ],
    });

    const projectState = ProjectState.fromSerialized(fileString);

    if (Array.isArray(projectState)) {
      setProjectStateErrors(projectState);
      setProjectState(undefined);
      return;
    } else {
      setProjectStateErrors([]);
      setProjectState(projectState);
    }
    modifySearchParams(() => ({}));
    autosave();
  }, [modifySearchParams, setProjectState, setProjectStateErrors]);

  const resetToInitial = useCallback(async () => {
    setProjectState(new ProjectState());

    autosave();
  }, [setProjectState]);

  // Autosave stuff
  const idbWrapper = useIpsumIDBWrapper();

  const [hasLoadedAutosave, setHasLoadedAutosave] = useState(false);

  useEffect(() => {
    if (!hasLoadedAutosave && idbWrapper !== undefined) {
      idbWrapper.getAutosaveValue().then((state) => {
        if (!state) {
          setProjectState(new ProjectState());
          setHasLoadedAutosave(true);
        } else {
          const stateFromAutosave = ProjectState.fromSerialized(state);

          if (Array.isArray(stateFromAutosave)) {
            setProjectStateErrors(stateFromAutosave);
            setProjectState(undefined);
          } else {
            setProjectState(stateFromAutosave);
            setProjectStateErrors([]);
          }

          setHasLoadedAutosave(true);
        }
      });
    }
  }, [hasLoadedAutosave, idbWrapper, setProjectState, setProjectStateErrors]);

  const dom = (() => {
    if (hasLoadedAutosave) {
      return children;
    } else {
      return <p>loading autosave...</p>;
    }
  })();

  return (
    <SerializationContext.Provider
      value={{
        saveToFile: disabled ? async () => {} : saveToFile,
        loadFromFile: disabled ? async () => {} : loadFromFile,
        resetToInitial: disabled ? () => {} : resetToInitial,
        hasLoadedAutosave,
      }}
    >
      {dom}
    </SerializationContext.Provider>
  );
};
