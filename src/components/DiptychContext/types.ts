import { URLLayer } from "util/url";

export interface HighlightBreadcrumb {
  type: "highlight";
  highlightId: string;
}

export interface ArcBreadcrumb {
  type: "arc";
  arcId: string;
}

export interface JournalEntryBreadcrumb {
  type: "journal_entry";
  journalEntryId?: string;
}

export type Breadcrumb =
  | HighlightBreadcrumb
  | ArcBreadcrumb
  | JournalEntryBreadcrumb;

export interface Diptych {
  layers: URLLayer[];
  orderedBreadcrumbs: Breadcrumb[];

  pushLayer: (layer: URLLayer) => void;
  setTopHighlightFrom: (
    highlightFrom: string,
    highlightFromUrlDate: string
  ) => void;
  setTopHighlightTo: (
    highlightTo: string,
    highlightFromUrlDate: string
  ) => void;

  selectedHighlightId?: string;
}
