import type { URLFunction } from "../types";

export const setJournalSettingsDrawerOpen: URLFunction<boolean, "journal"> = (
  open,
  state
) => {
  state.settings = { ...state.settings, open: `${true}` };
  return state;
};
