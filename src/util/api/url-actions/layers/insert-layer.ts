import { URLLayer } from "util/state";

import { URLFunction } from "../types";

export const insertLayer: URLFunction<
  { layer: Required<URLLayer>; index: number },
  "journal"
> = (props, state) => {
  state.layers.splice(props.index, 0, props.layer);
  return state;
};
