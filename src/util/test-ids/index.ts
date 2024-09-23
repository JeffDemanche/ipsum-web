export const TestIds = {
  Editor: {
    ApplyHighlightButton: "editor.apply-highlight-button",
  },
  DailyJournal: {
    DailyJournal: "daily-journal.daily-journal",
    MonthlyNav: "daily-journal.monthly-nav",
    MonthlyNavEntryButton: (label: string) =>
      `daily-journal.monthly-nav-entry-button-${label}`,
  },
};
