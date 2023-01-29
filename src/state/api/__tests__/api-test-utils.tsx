import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useReducer } from "react";
import { InMemoryAction } from "state/in-memory/in-memory-actions";
import { reducer } from "state/in-memory/in-memory-context";
import { InMemoryState } from "state/in-memory/in-memory-schema";
import { MockInMemoryStateProvider } from "state/in-memory/__tests__/MockInMemoryStateProvider";
import {
  APIFunctionActParams,
  APIFunctionName,
  useApiAction,
} from "../use-api-action";

/**
 * A component that will dispatch API calls for unit testing.
 * - `beforeState` is the initial `InMemoryState` object before running.
 * - `actions` is an array of functions which execute API calls. Using multiple
 *   functions allows for waiting for `context.state` to be updated between
 *   them.
 */
export const APIDispatcher = <T extends APIFunctionName>({
  beforeState,
  calls,
  onStateChange,
  onData,
  onError,
}: {
  beforeState: InMemoryState;
  calls: ((state: InMemoryState) => {
    name: T;
    actParams: APIFunctionActParams<T>;
  })[];
  onStateChange?: (state: InMemoryState) => void;
  onData?: (data: ReturnType<typeof useApiAction>["data"]) => void;
  onError?: (error: ReturnType<typeof useApiAction>["error"]) => void;
}) => {
  const [state, dispatch] = useReducer(reducer, beforeState);

  const optimisticDispatch = useCallback(
    (state: InMemoryState, action: InMemoryAction) => {
      return reducer(state, action);
    },
    []
  );

  return (
    <MockInMemoryStateProvider
      state={state}
      dispatch={dispatch}
      optimisticDispatch={optimisticDispatch}
      reloadEditor={() => {}}
    >
      <APIDispatcherWithState
        calls={calls}
        state={state}
        onStateChange={onStateChange}
        onData={onData}
      ></APIDispatcherWithState>
    </MockInMemoryStateProvider>
  );
};

const APIDispatcherWithState = <T extends APIFunctionName>({
  calls,
  state,
  onStateChange,
  onData,
  onError,
}: {
  calls: ((state: InMemoryState) => {
    name: T;
    actParams: APIFunctionActParams<T>;
  })[];
  state: InMemoryState;
  onStateChange?: (state: InMemoryState) => void;
  onData?: (data: ReturnType<typeof useApiAction>["data"]) => void;
  onError?: (data: ReturnType<typeof useApiAction>["error"]) => void;
}) => {
  const [remainingActions, setRemainingActions] = useState(calls);

  const currentAction = useMemo(() => remainingActions[0], [remainingActions]);

  const { data, loading, error, act } = useApiAction(
    {
      name: currentAction?.(state).name,
    },
    !currentAction
  );

  useEffect(() => {
    if (currentAction) {
      act(currentAction?.(state).actParams);
      const poppedActions = [...remainingActions];
      poppedActions.shift();
      setRemainingActions(poppedActions);
    }
  }, [act, currentAction, remainingActions, state]);

  useEffect(() => {
    onStateChange?.(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    onData?.(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    onError?.(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return <div></div>;
};
