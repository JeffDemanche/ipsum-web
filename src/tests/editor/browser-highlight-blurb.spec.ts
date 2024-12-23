import { expect, test } from "@playwright/test";
import { TestIds } from "util/test-ids";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:9000/journal");
});

test.describe("Browser Highlight Blurb", () => {
  test("deleting a highlight from the browser removes the highlight blurb and the highlight from the daily journal content editable", async ({
    page,
  }) => {
    const paragraphText =
      "Tonight, under the serene glow of the full moon, I sit by the riverbank, feeling the soft caress of the cool breeze. The murmurs of the flowing water create a symphony that resonates with the depths of my soul. It has been a day of profound contemplation, one that has stirred the depths of my being and ignited within me a thirst for knowledge and understanding.";

    const contentEditable = await page.getByTestId(
      TestIds.EntryEditor.ContentEditable
    );

    await contentEditable.fill(paragraphText);

    // Wait for entry debounce.
    await page.waitForTimeout(1000);

    await contentEditable.press("Meta+a");

    const applyHighlightButton = page.getByTestId(
      TestIds.FormattingControls.HighlightButton
    );

    await applyHighlightButton.click();

    await page.waitForTimeout(1000);

    const highlightBlurb = page.getByTestId(
      TestIds.HighlightBlurb.HighlightBlurb
    );

    await expect(highlightBlurb).toBeVisible();

    await highlightBlurb.click();

    await page.waitForTimeout(1000);

    const deleteHighlightButton = page
      .getByTestId(TestIds.HighlightBlurb.HighlightBlurb)
      .getByTestId(TestIds.HighlightFunctionButtons.DeleteButton);

    expect(highlightBlurb).toBeVisible();

    await deleteHighlightButton.click();

    expect(highlightBlurb).not.toBeVisible();

    const paragraphSpan = await contentEditable.locator("[data-highlight-id]");

    await expect(paragraphSpan).not.toBeVisible();
  });
});
