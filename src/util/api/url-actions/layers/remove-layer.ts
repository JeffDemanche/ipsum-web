import { URLFunction } from "../types";

export const removeLayer: URLFunction<{ index: number }, "journal"> = (
  props,
  state
) => {
  state.layers.splice(props.index, 1);
  return state;
};
