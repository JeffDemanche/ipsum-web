export type View = "" | "journal";

export type LayerType = "connection_only" | "daily_journal" | "arc_detail";

export type BaseURLLayer = {
  type: LayerType;
  connectionId?: string;
};

interface ConnectionOnlyLayer extends BaseURLLayer {
  type: "connection_only";
  connectionId: string;
}

interface DailyJournalURLLayer extends BaseURLLayer {
  type: "daily_journal";
  startDate?: string;
  endDate?: string;
}

interface ArcDetailURLLayer extends BaseURLLayer {
  type: "arc_detail";
  arcId: string;
}

export type URLLayer =
  | ConnectionOnlyLayer
  | DailyJournalURLLayer
  | ArcDetailURLLayer;

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
