import { URLLayer } from "util/url";

interface HighlightBreadcrumb {
  type: "highlight";
  highlightId: string;
}

interface ArcBreadcrumb {
  type: "arc";
  arcId: string;
}

interface JournalEntryBreadcrumb {
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
}
