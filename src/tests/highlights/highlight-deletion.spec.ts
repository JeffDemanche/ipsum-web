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

    const firstHighlightTagTextContextBefore =
      await firstHighlightTagObject.textContent();

    await firstHighlightTagObject.click();

    const highlightPage = page.getByTestId(TestIds.HighlightPage.HighlightPage);

    const deleteButton = highlightPage.getByTestId(
      TestIds.HighlightFunctionButtons.DeleteButton
    );

    await deleteButton.click();

    await page.waitForTimeout(500);

    const firstHighlightTagTextContextAfter =
      await firstHighlightTagObject.textContent();

    expect(firstHighlightTagTextContextBefore).not.toEqual(
      firstHighlightTagTextContextAfter
    );

    expect(
      page.getByTestId(TestIds.HighlightPage.HighlightPage)
    ).not.toBeVisible();
  });
});
