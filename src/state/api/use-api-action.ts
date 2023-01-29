/**
 * This package is an abstraction layer on top of what is currently just the
 * InMemoryState. That is a pure React reducer, which has certain constraints
 * that I think will make it advantageous to have a broader set of controller
 * functions between it and the UI.
 */

import { useCallback, useContext, useState } from "react";
import { InMemoryAction } from "state/in-memory/in-memory-actions";
import { InMemoryStateContext } from "state/in-memory/in-memory-context";
import { InMemoryState } from "state/in-memory/in-memory-schema";
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
  optimisticStateDispatch: (
    state: InMemoryState,
    action: InMemoryAction
  ) => APIContext;
  reloadEditor: () => void;
}

export interface APIReturn {
  state: InMemoryState;
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

export type APIFunctionName = keyof typeof APIFunctions;

export type APIFunctionActParams<T extends APIFunctionName> = Parameters<
  typeof APIFunctions[T]
>[0];

interface UseApiActionArgs<T extends APIFunctionName> {
  name: T;
}

interface UseApiActionResult<T extends APIFunctionName> {
  act?: (params: APIFunctionActParams<T>) => void;
  data?: ReturnType<typeof APIFunctions[T]>;
  loading: boolean;
  error?: Error;
}

export const useApiAction = <T extends APIFunctionName>(
  apiCall: UseApiActionArgs<T>,
  skip?: boolean
): UseApiActionResult<T> => {
  const { state, dispatch, optimisticDispatch, reloadEditor } =
    useContext(InMemoryStateContext);

  const [isLoadingPromise, setIsLoadingPromise] = useState(false);
  const [data, setData] = useState<ReturnType<typeof APIFunctions[T]>>();
  const [error, setError] = useState<Error>();

  const optimisticStateDispatch = useCallback(
    (state: InMemoryState, action: InMemoryAction): APIContext => {
      const newState = optimisticDispatch(state, action);
      return {
        state: newState,
        optimisticStateDispatch,
        reloadEditor,
      };
    },
    [optimisticDispatch, reloadEditor]
  );

  if (skip) {
    return {
      loading: false,
    };
  }

  if (!dispatch)
    return {
      loading: false,
      error: new Error("Tried to use API outside of InMemoryStateContext"),
    };

  return {
    loading: isLoadingPromise,
    data,
    error,
    act: (params) => {
      try {
        // @ts-ignore
        const data = APIFunctions[apiCall.name](params, {
          state,
          dispatch,
          optimisticStateDispatch,
          reloadEditor,
        });
        if (data) {
          dispatch({
            type: "OVERWRITE",
            payload: { newState: data.state },
          });
        }
        // setData(data);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    },
  };
};
