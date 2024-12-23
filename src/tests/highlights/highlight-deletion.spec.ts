import { expect, test } from "@playwright/test";
import { TestIds } from "util/test-ids";

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2020-01-01T08:00:00") });

  await page.goto("http://localhost:9000/journal/?siddhartha");
});

test.describe("Highlight Deletion", () => {
  test("deleting a highlight from the highlight page removes it from the journal entry and closes the page", async ({
    page,
  }) => {
    const dailyJournalEntry = page.getByTestId(
      TestIds.DailyJournalEntry.DailyJournalEntry
    );

    const firstHighlightTagObject = dailyJournalEntry
      .getByTestId(TestIds.HighlightTag.ObjectTextButton)
      .first();

    await firstHighlightTagObject.click();

    const highlightPage = page.getByTestId(TestIds.HighlightPage.HighlightPage);

    const deleteButton = highlightPage.getByTestId(
      TestIds.HighlightFunctionButtons.DeleteButton
    );

    await deleteButton.click();

    const highlightBlurbs = await dailyJournalEntry
      .getByTestId(TestIds.HighlightBlurb.HighlightBlurb)
      .all();

    expect(highlightBlurbs).toHaveLength(0);

    expect(await page.isVisible(TestIds.HighlightPage.HighlightPage)).toBe(
      false
    );
  });
});
