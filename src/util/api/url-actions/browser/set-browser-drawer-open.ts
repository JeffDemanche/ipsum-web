import { URLFunction } from "../types";

export const setBrowserDrawerOpen: URLFunction<boolean, "journal"> = (
  open,
  state
) => {
  state.browser = {
    ...state.browser,
    open: open,
  };
  return state;
};
