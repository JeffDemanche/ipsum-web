import type { URLLayer } from "util/state";

import type { URLFunction } from "../types";

export const insertLayer: URLFunction<
  { layer: Required<URLLayer>; index?: number },
  "journal"
> = (props, state) => {
  if (props.index === undefined) {
    state.layers.push(props.layer);
  } else {
    state.layers.splice(props.index, 0, props.layer);
  }
  return state;
};
