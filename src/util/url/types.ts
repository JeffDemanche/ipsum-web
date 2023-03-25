export type View = "" | "journal";

export type LayerType = "daily_journal" | "arc_detail";

export type URLLayer = {
  type: LayerType;
  objectId?: string;
  connectionId?: string;
};

interface JournalViewSearchData {
  highlight?: string[];
  layers?: URLLayer[];
}

type EmptySearchData = unknown;

/**
 * We can define the URL structure in terms of a Javascript object and then use
 * the qs package to handle decoding/encoding.
 */
export type IpsumURLSearch<V extends View> = {
  journal: JournalViewSearchData;
  "": EmptySearchData;
}[V];
