export type View = "" | "journal";

export type LayerType = "connection_only" | "daily_journal" | "arc_detail";

export type BaseURLLayer = {
  type: LayerType;

  /** The highlight linked to *from* this layer. */
  highlightFrom?: string;

  /**
   * The entry key of the highlight linked to from this layer. Only valid if
   * `highlightFrom` is defined.
   */
  highlightFromEntryKey?: string;

  /**
   * The highlight which links *to* the next layer. This can be different from
   * `highlightFrom`. Only valid if `highlightFrom` is defined.
   */
  highlightTo?: string;

  /**
   * The entry key of the highlight which links to the next layer. Only valid if
   * `highlightFrom` and `highlightTo` are defined.
   */
  highlightToEntryKey?: string;
};

export interface DailyJournalURLLayer extends BaseURLLayer {
  type: "daily_journal";
  focusedDate?: string;
}

export interface ArcDetailURLLayer extends BaseURLLayer {
  type: "arc_detail";
  arcId: string;
}

export type URLLayer = DailyJournalURLLayer | ArcDetailURLLayer;

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
