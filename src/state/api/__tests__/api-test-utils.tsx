import { InMemoryStateContext } from "components/InMemoryStateContext/InMemoryStateContext";
import React, { useContext, useMemo, useReducer, useState } from "react";
import { useEffect } from "react";
import { InMemoryState, reducer } from "state/in-memory/in-memory-state";
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

  return (
    <MockInMemoryStateProvider
      state={state}
      dispatch={dispatch}
      reloadEditor={() => {}}
    >
      <APIDispatcherWithState
        calls={calls}
        onStateChange={onStateChange}
        onData={onData}
      ></APIDispatcherWithState>
    </MockInMemoryStateProvider>
  );
};

const APIDispatcherWithState = <T extends APIFunctionName>({
  calls,
  onStateChange,
  onData,
  onError,
}: {
  calls: ((state: InMemoryState) => {
    name: T;
    actParams: APIFunctionActParams<T>;
  })[];
  onStateChange?: (state: InMemoryState) => void;
  onData?: (data: ReturnType<typeof useApiAction>["data"]) => void;
  onError?: (data: ReturnType<typeof useApiAction>["error"]) => void;
}) => {
  const [remainingActions, setRemainingActions] = useState(calls);

  const { state } = useContext(InMemoryStateContext);

  const currentAction = useMemo(
    () => remainingActions[0]?.(state),
    [remainingActions, state]
  );

  const { data, loading, error, act } = useApiAction(
    {
      name: currentAction?.name,
    },
    !currentAction
  );

  useEffect(() => {
    if (currentAction) {
      act(currentAction.actParams);
      const poppedActions = [...remainingActions];
      poppedActions.shift();
      setRemainingActions(poppedActions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [act, currentAction, remainingActions]);

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
