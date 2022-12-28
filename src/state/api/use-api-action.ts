/**
 * This package is an abstraction layer on top of what is currently just the
 * InMemoryState. That is a pure React reducer, which has certain constraints
 * that I think will make it advantageous to have a broader set of controller
 * functions between it and the UI.
 */

import { useContext, useEffect, useState } from "react";
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
  const { state, dispatch, reloadEditor } = useContext(InMemoryStateContext);

  const [isLoadingPromise, setIsLoadingPromise] = useState(false);
  const [data, setData] = useState<ReturnType<typeof APIFunctions[T]>>();
  const [error, setError] = useState<Error>();

  const [remainingDispatchers, setRemainingDispatchers] = useState<
    ((context: APIContext, previousReturn: any) => unknown)[]
  >([]);
  const [lastReturn, setLastReturn] = useState<any>(undefined);

  useEffect(() => {
    if (remainingDispatchers.length > 0) {
      setLastReturn(
        remainingDispatchers[0]({ state, dispatch, reloadEditor }, lastReturn)
      );
      const poppedActions = [...remainingDispatchers];
      poppedActions.shift();
      setRemainingDispatchers(poppedActions);
    } else {
      setData(lastReturn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingDispatchers]);

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
        const fn = APIFunctions[apiCall.name];
        setRemainingDispatchers(
          // @ts-ignore sue me
          fn(params, {
            dispatch,
            state,
            reloadEditor,
          }) as ReturnType<typeof APIFunctions[T]>
        );
      } catch (err) {
        console.error(err);
        setError(err);
      }
    },
  };
};
