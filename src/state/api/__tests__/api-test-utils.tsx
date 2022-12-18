import React, { useState } from "react";
import { useEffect, useReducer } from "react";
import { InMemoryState, reducer } from "state/in-memory/in-memory-state";
import { APIContext } from "../use-api-action";

/**
 * A component that will dispatch API calls for unit testing.
 * - `beforeState` is the initial `InMemoryState` object before running.
 * - `actions` is an array of functions which execute API calls. Using multiple
 *   functions allows for waiting for `context.state` to be updated between
 *   them.
 */
export const APIDispatcher: React.FunctionComponent<{
  beforeState: InMemoryState;
  action: Array<(context: APIContext) => void>;
  onStateChange: (state: InMemoryState) => void;
}> = ({ beforeState, action, onStateChange }) => {
  const [remainingActions, setRemainingActions] = useState(
    Array.isArray(action)
      ? (action as ((context: APIContext) => void)[])
      : [action]
  );

  const [state, dispatch] = useReducer(reducer, beforeState);

  useEffect(() => {
    if (remainingActions.length > 0) {
      remainingActions[0]({ state, dispatch, reloadEditor: jest.fn() });
      const poppedActions = [...remainingActions];
      poppedActions.shift();
      setRemainingActions(poppedActions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingActions]);

  useEffect(() => {
    onStateChange(state);
  }, [onStateChange, state]);

  return <div></div>;
};
