interface BaseBreadcrumb {
  visible?: boolean;
}

export interface HighlightBreadcrumb extends BaseBreadcrumb {
  type: "highlight";
  highlightId: string;
}

export interface ArcBreadcrumb extends BaseBreadcrumb {
  type: "arc";
  arcId: string;
}

export interface JournalEntryBreadcrumb extends BaseBreadcrumb {
  type: "journal_entry";
  journalEntryId?: string;
}

export type BreadcrumbType =
  | HighlightBreadcrumb
  | ArcBreadcrumb
  | JournalEntryBreadcrumb;
