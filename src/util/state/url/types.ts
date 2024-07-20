export type View = "" | "journal";

export type LayerType =
  | "connection_only"
  | "daily_journal"
  | "arc_detail"
  | "highlight_detail";

export type BaseURLLayer = {
  type: LayerType;
};

export interface DailyJournalURLLayer extends BaseURLLayer {
  type: "daily_journal";
  mode?: "today" | "past";
  focusedDate?: string;
  visibleDates?: string[];
}

export interface ArcDetailURLLayer extends BaseURLLayer {
  type: "arc_detail";
  arcId: string;
}

export interface HighlightDetailURLLayer extends BaseURLLayer {
  type: "highlight_detail";
  highlightId: string;
}

export type URLLayer =
  | DailyJournalURLLayer
  | ArcDetailURLLayer
  | HighlightDetailURLLayer;

interface URLHighlightCriterion {
  days?: {
    days: string[];
  };
  relatesToArc?: {
    arcId: string;
    predicates?: string[];
  };
  relatesToHighlight?: {
    highlightId: string;
  };
}

export interface URLSearchCriteria {
  and?: {
    or: URLHighlightCriterion[];
  }[];
}

interface URLJournalView {
  layers?: URLLayer[];
  searchCriteria?: URLSearchCriteria;
  highlight?: string;
  sort?: "date" | "importance";
}

type EmptySearchData = unknown;

/**
 * We can define the URL structure in terms of a Javascript object and then use
 * the qs package to handle decoding/encoding.
 */
export type IpsumURLSearch<V extends View> = {
  journal: URLJournalView;
  "": EmptySearchData;
}[V];
