export const TestIds = {
  ArcPage: {
    ArcPage: "arc-page.arc-page",
  },
  ArcTag: {
    ArcTag: "arc-tag.arc-tag",
    LinkButton: "arc-tag.link-button",
  },
  BrowserDrawer: {
    BrowserDrawerOpened: "browser-drawer.browser-drawer-opened",
  },
  Entry: {
    HighlightsList: "entry.highlights-list",
  },
  DailyJournal: {
    DailyJournal: "daily-journal.daily-journal",
    MonthlyNav: "daily-journal.monthly-nav",
    MonthlyNavEntryButton: (label: string) =>
      `daily-journal.monthly-nav-entry-button.${label}`,
  },
  HighlightBlurb: {
    HighlightBlurb: "highlight-blurb.highlight-blurb",
    DeleteButton: "highlight-blurb.delete-button",
  },
  HighlightTag: {
    HighlightTag: "highlight-tag.highlight-tag",
  },
  FormattingControls: {
    HighlightButton: "formatting-controls.highlight-button",
  },
  RelationChooser: {
    RelationChooser: "relation-chooser.relation-chooser",
    ArcSearchField: "relation-chooser.arc-search-field",
  },
  RelationsTable: {
    RelationsTable: "relations-table.relations-table",
    PredicateRow: "relations-table.predicate-row",
    EmptyTableAddLinkButton: "relations-table.empty-table-add-link-button",
  },
};
