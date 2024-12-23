import type { URLFunction } from "../types";

export const removeHighlightLayer: URLFunction<
  { highlightId: string },
  "journal"
> = (props, state) => {
  state.layers = state.layers.filter(
    (layer) =>
      layer.type !== "highlight_detail" ||
      layer.highlightId !== props.highlightId
  );
  return state;
};
