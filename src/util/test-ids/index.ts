import { BrowserDrawer } from "components/organisms/BrowserDrawer";

export const TestIds = {
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
};
