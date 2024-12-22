import type { URLFunction } from "../types";

export const setLayerExpanded: URLFunction<
  { index: number; expanded: boolean },
  "journal"
> = (props, state) => {
  if (!state.layers[props.index]) {
    throw new Error(`Layer at index ${props.index} does not exist in URL`);
  }

  state.layers[props.index].expanded = `${props.expanded}`;
  return state;
};
