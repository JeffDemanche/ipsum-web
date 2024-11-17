import React, { createContext, useCallback, useEffect, useState } from "react";
import { useIpsumIDBWrapper } from "util/indexed-db";
import { readFromFile, validate, writeToFile } from "util/serializer";
import {
  DeserializationResult,
  PROJECT_STATE,
  ProjectState,
  useModifySearchParams,
} from "util/state";

import { autosave } from "./autosave";

interface ApolloSerialization {
  saveToFile: () => Promise<void>;
  loadFromFile: () => Promise<void>;
  resetToInitial: () => void;
  validatorFix: () => void;
  hasLoadedAutosave: boolean;
}

export const SerializationContext = createContext<ApolloSerialization>({
  saveToFile: async () => {},
  loadFromFile: async () => {},
  resetToInitial: () => {},
  validatorFix: () => {},
  hasLoadedAutosave: false,
});

interface SerializationProviderProps {
  disableLoadFromAutosave: boolean;
  setProjectState: (projectState: ProjectState) => void;
  deserializationResult: DeserializationResult;
  setDeserializationResult: (result: DeserializationResult) => void;
  children: React.ReactNode;
}

/**
 * A wrapper that 1. reads from IDB autosave data and 2. handles loading and
 * saving Apollo state to file.
 */
export const SerializationProvider: React.FunctionComponent<
  SerializationProviderProps
> = ({
  disableLoadFromAutosave,
  setProjectState,
  deserializationResult,
  setDeserializationResult,
  children,
}) => {
  const saveToFile = async () => {
    await writeToFile(PROJECT_STATE.toSerialized(), {
      excludeAcceptAllOption: true,
      suggestedName: `${PROJECT_STATE.get("journalTitle")}.ipsum`,
      types: [
        { description: "Ipsum Files", accept: { "text/plain": [".ipsum"] } },
      ],
    });
  };

  const loadFromString = useCallback(
    (fileString: string) => {
      const deserializationResult = ProjectState.fromSerialized(fileString);

      if (deserializationResult.result === "success") {
        setProjectState(deserializationResult.state);
      }
      setDeserializationResult(deserializationResult);
    },
    [setDeserializationResult, setProjectState]
  );

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

    loadFromString(fileString);

    modifySearchParams(() => ({}));
    autosave();
  }, [loadFromString, modifySearchParams]);

  const resetToInitial = useCallback(async () => {
    setProjectState(new ProjectState());

    autosave();
  }, [setProjectState]);

  const validatorFix = () => {
    if (deserializationResult.result === "validator_error") {
      const fixedStaticState = deserializationResult.validator.fix();

      if (validate(fixedStaticState).result === "pass") {
        const projectState = new ProjectState(fixedStaticState);
        setDeserializationResult({ result: "success", state: projectState });
        setProjectState(projectState);
      }
    }
  };

  // Autosave stuff
  const idbWrapper = useIpsumIDBWrapper();

  const [hasLoadedAutosave, setHasLoadedAutosave] = useState(false);

  useEffect(() => {
    if (disableLoadFromAutosave) {
      setHasLoadedAutosave(true);
      return;
    }

    if (!hasLoadedAutosave && idbWrapper !== undefined) {
      idbWrapper.getAutosaveValue().then((state) => {
        if (!state) {
          setProjectState(new ProjectState());
          setHasLoadedAutosave(true);
        } else {
          loadFromString(state);

          setHasLoadedAutosave(true);
        }
      });
    }
  }, [
    disableLoadFromAutosave,
    hasLoadedAutosave,
    idbWrapper,
    loadFromString,
    setProjectState,
  ]);

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
        saveToFile,
        loadFromFile,
        resetToInitial,
        validatorFix,
        hasLoadedAutosave,
      }}
    >
      {dom}
    </SerializationContext.Provider>
  );
};
