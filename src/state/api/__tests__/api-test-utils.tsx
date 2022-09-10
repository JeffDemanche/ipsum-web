import React from "react";
import { useEffect, useReducer } from "react";
import { InMemoryState, reducer } from "state/in-memory/in-memory-state";
import { APIContext } from "../use-api-action";

export const APIDispatcher: React.FunctionComponent<{
  beforeState: InMemoryState;
  action: (context: APIContext) => void;
  onStateChange: (state: InMemoryState) => void;
}> = ({ beforeState, action, onStateChange }) => {
  const [state, dispatch] = useReducer(reducer, beforeState);

  useEffect(() => {
    action({ dispatch, reloadEditor: jest.fn() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onStateChange(state);
  }, [onStateChange, state]);

  return <div></div>;
};
