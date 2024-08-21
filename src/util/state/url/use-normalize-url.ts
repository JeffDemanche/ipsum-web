import { useEffect, useRef } from "react";
import { urlOverwriteJournalUrl, useUrlAction } from "util/api";
import { IpsumDay } from "util/dates";

import { useIpsumSearchParams } from ".";
import { IpsumURLSearch, View } from "./types";

/**
 * This hook gets run toward the top of the app to transform the URL when it's
 * in an invalid state.
 */
export const useNormalizeUrl = (view: View) => {
  const params = useIpsumSearchParams<typeof view>();

  const overwriteJournalUrl = useUrlAction(urlOverwriteJournalUrl);

  const complete = useRef(false);

  useEffect(() => {
    if (complete.current) {
      return;
    }

    switch (view) {
      case "journal":
        overwriteJournalUrl(normalizeJournalUrl(params));
    }
    complete.current = true;
  }, [params, view, overwriteJournalUrl]);
};

const normalizeJournalUrl = (
  params: IpsumURLSearch<"journal">
): IpsumURLSearch<"journal"> => {
  if (!params?.layers) {
    params.layers = [
      {
        type: "daily_journal",
        day: IpsumDay.today().toString("url-format"),
        expanded: true,
      },
    ];
  }

  return params;
};
