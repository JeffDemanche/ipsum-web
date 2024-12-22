import type { URLFunction } from "../types";

export const setHighlightsOptionsDrawerOpen: URLFunction<boolean, "journal"> = (
  open,
  state
) => {
  state.browser = {
    ...state.browser,
    tab: {
      ...state.browser?.tab,
      optionsOpen: open,
    },
  };
  return state;
};
