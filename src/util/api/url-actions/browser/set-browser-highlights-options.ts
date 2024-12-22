import type {
  URLHighlightFilterCriteria,
  URLHighlightSortCriteria,
} from "util/state";

import type { URLFunction } from "../types";

export const setBrowserDrawerHighlightsOptions: URLFunction<
  {
    filters?: URLHighlightFilterCriteria;
    sort?: URLHighlightSortCriteria;
  },
  "journal"
> = (args, state) => {
  if (
    state.browser?.tab?.type !== undefined &&
    state.browser?.tab?.type !== "highlights"
  ) {
    return state;
  }

  state.browser = {
    ...state.browser,
    tab: {
      ...state.browser?.tab,
      filters: {
        ...state.browser?.tab?.filters,
        ...args.filters,
      },
      sort: {
        ...state.browser?.tab?.sort,
        ...args.sort,
      },
    },
  };
  return state;
};
