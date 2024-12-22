import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { urlOverwriteJournalUrl, useUrlAction } from "util/api";
import { IpsumDay } from "util/dates";

import { useIpsumSearchParams } from ".";
import type { IpsumURLSearch, View } from "./types";

/**
 * This hook gets run toward the top of the app to transform the URL when it's
 * in an invalid state.
 */
export const useNormalizeUrl = (view: View) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has("siddhartha")) {
      searchParams.delete("siddhartha");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const params = useIpsumSearchParams<typeof view>();

  const overwriteJournalUrl = useUrlAction(urlOverwriteJournalUrl);

  useEffect(() => {
    switch (view) {
      case "journal": {
        const normalizedParams = normalizeJournalUrl(params);
        if (JSON.stringify(normalizedParams) !== JSON.stringify(params)) {
          overwriteJournalUrl(normalizedParams);
        }
      }
    }
  }, [params, view, overwriteJournalUrl]);
};

const normalizeJournalUrl = (
  params: Readonly<IpsumURLSearch<"journal">>
): IpsumURLSearch<"journal"> => {
  const newParams = { ...params };

  if (!newParams?.layers || newParams.layers.length === 0) {
    newParams.layers = [
      {
        type: "daily_journal",
        day: IpsumDay.today().toString("url-format"),
        expanded: "true",
      },
    ];
  }

  return newParams;
};
