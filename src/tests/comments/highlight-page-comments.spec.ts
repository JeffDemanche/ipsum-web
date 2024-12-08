import { expect, test } from "@playwright/test";
import { TestIds } from "util/test-ids";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:9000/journal/?siddhartha");
});

test.describe("Highlight Page Comments", () => {
  test("writing a comment on a highlight adds it to today's journal entry", async ({
    page,
  }) => {
    const drawer = page.getByTestId(TestIds.BrowserDrawer.BrowserDrawerOpened);

    const firstHighlightBlurb = drawer
      .getByTestId(TestIds.HighlightBlurb.HighlightBlurb)
      .first();

    await firstHighlightBlurb.click();

    const tagObjectButton = firstHighlightBlurb.getByTestId(
      TestIds.HighlightTag.ObjectTextButton
    );

    await tagObjectButton.click();

    const highlightPage = page.getByTestId(TestIds.HighlightPage.HighlightPage);

    const comments = highlightPage.getByTestId(TestIds.Comments.Comments);

    const entryEditor = comments.getByTestId(TestIds.EntryEditor.EntryEditor);

    const contentEditable = entryEditor.getByTestId(
      TestIds.EntryEditor.ContentEditable
    );

    await contentEditable.fill("This is a comment");

    await page.waitForTimeout(1000);

    const dailyJournalEntry = page.getByTestId(
      TestIds.DailyJournalEntry.DailyJournalEntry
    );

    const dailyJournalEntryContent = dailyJournalEntry.getByTestId(
      TestIds.EntryEditor.ContentEditable
    );

    expect(await dailyJournalEntryContent.textContent()).toContain(
      "This is a comment"
    );
  });
});
