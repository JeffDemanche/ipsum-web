import { useModifySearchParams, View } from "util/state";

import { URLFunction } from "./types";

export const useUrlAction = <T, V extends View>(
  urlAction: URLFunction<T, V>
) => {
  const modifySearchParams = useModifySearchParams<V>();

  return (args: T) => {
    modifySearchParams((state) => urlAction(args, state));
  };
};

export { overwriteJournalUrl as urlOverwriteJournalUrl } from "./overwrite-journal-url";

export { setBrowserDrawerOpen as urlSetBrowserDrawerOpen } from "./browser/set-browser-drawer-open";
export { setHighlightsOptionsDrawerOpen as urlSetHighlightsOptionsDrawerOpen } from "./browser/set-highlights-options-drawer-open";
export { setBrowserDrawerHighlightsOptions as urlSetBrowserDrawerHighlightsOptions } from "./browser/set-browser-highlights-options";

export { setJournalSettingsDrawerOpen as urlSetJournalSettingsDrawerOpen } from "./journal-settings/set-journal-settings-drawer-open";

export { insertLayer as urlInsertLayer } from "./layers/insert-layer";
export { removeLayer as urlRemoveLayer } from "./layers/remove-layer";
export { setDailyJournalLayerDay as urlSetDailyJournalLayerDay } from "./layers/set-daily-journal-layer-day";
export { setLayerExpanded as urlSetLayerExpanded } from "./layers/set-layer-expanded";
