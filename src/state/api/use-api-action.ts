/**
 * This package is an abstraction layer on top of what is currently just the
 * InMemoryState. That is a pure React reducer, which has certain constraints
 * that I think will make it advantageous to have a broader set of controller
 * functions between it and the UI.
 */

import { useContext, useState } from "react";
import { InMemoryAction } from "state/in-memory/in-memory-actions";
import { InMemoryState } from "state/in-memory/in-memory-state";
import { InMemoryStateContext } from "components/InMemoryStateContext/InMemoryStateContext";
import {
  apiAssignArc,
  apiCreateAndAssignArc,
  apiUnassignArc,
  apiUpdateArc,
} from "./arc";
import { apiCreateOrUpdateEntry, apiDeleteEntry } from "./entry";
import { apiUpdateJournalTitle } from "./journalTitle";

export interface APIContext {
  state: InMemoryState;
  dispatch: React.Dispatch<InMemoryAction>;
  reloadEditor: () => void;
}

const APIFunctions = {
  createOrUpdateEntry: apiCreateOrUpdateEntry,
  deleteEntry: apiDeleteEntry,

  createAndAssignArc: apiCreateAndAssignArc,
  assignArc: apiAssignArc,
  unassignArc: apiUnassignArc,
  updateArc: apiUpdateArc,

  updateJournalTitle: apiUpdateJournalTitle,
};

interface UseApiActionArgs<T extends keyof typeof APIFunctions> {
  name: T;
}

interface UseApiActionResult<T extends keyof typeof APIFunctions> {
  act?: (
    params: Parameters<typeof APIFunctions[T]>[0]
  ) => ReturnType<typeof APIFunctions[T]>;
  data?: ReturnType<typeof APIFunctions[T]>;
  loading: boolean;
  error?: Error;
}

export const useApiAction = <T extends keyof typeof APIFunctions>(
  apiCall: UseApiActionArgs<T>
): UseApiActionResult<T> => {
  const { state, dispatch, reloadEditor } = useContext(InMemoryStateContext);

  const [isLoadingPromise, setIsLoadingPromise] = useState(false);
  const [data, setData] = useState<ReturnType<typeof APIFunctions[T]>>();
  const [error, setError] = useState<Error>();

  if (!dispatch)
    return {
      loading: false,
      error: new Error("Tried to use API outside of InMemoryStateContext"),
    };

  return {
    loading: isLoadingPromise,
    data,
    error,
    act: (params): ReturnType<typeof APIFunctions[T]> => {
      try {
        const fn = APIFunctions[apiCall.name];
        // @ts-ignore sue me
        const result = fn(params, {
          dispatch,
          state,
          reloadEditor,
        }) as ReturnType<typeof APIFunctions[T]>;

        setData(result);
        return result;
      } catch (err) {
        console.error(err);
        setError(err);
        return null;
      }
    },
  };
};
