import { SortType } from "util/sort";

export type View = "" | "journal";

export type LayerType = "daily_journal" | "arc_detail" | "highlight_detail";

export type BaseURLLayer = {
  type: LayerType;
  expanded?: string;
};

export interface DailyJournalURLLayer extends BaseURLLayer {
  type: "daily_journal";
  day?: string;
}

export interface ArcDetailURLLayer extends BaseURLLayer {
  type: "arc_detail";
  arcId?: string;
}

export interface HighlightDetailURLLayer extends BaseURLLayer {
  type: "highlight_detail";
  highlightId?: string;
}

export type URLLayer =
  | DailyJournalURLLayer
  | ArcDetailURLLayer
  | HighlightDetailURLLayer;

interface URLHighlightCriterion {
  relatesToArc?: {
    arcId?: string;
    predicate?: string;
  };
}

export interface URLHighlightFilterCriteria {
  dateFrom?: string;
  dateTo?: string;
  and?: {
    or?: URLHighlightCriterion[];
  }[];
}

export interface URLHighlightSortCriteria {
  day?: string;
  type?: SortType;
}

export interface HighlightsBrowserTab {
  type?: "highlights";
  optionsOpen?: boolean;
  filters?: URLHighlightFilterCriteria;
  sort?: URLHighlightSortCriteria;
}

type TabState = HighlightsBrowserTab;

export interface URLBrowserState {
  open?: string;
  tab?: TabState;
}

export interface URLJournalSettingsState {
  open?: string;
}

export interface URLJournalView {
  layers?: URLLayer[];
  settings?: URLJournalSettingsState;
  browser?: URLBrowserState;
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
