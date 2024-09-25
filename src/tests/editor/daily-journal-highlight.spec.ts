import { expect, test } from "@playwright/test";
import { getCurrentLocalDateTime, IpsumDateTime } from "util/dates";
import { TestIds } from "util/test-ids";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:9000/journal/");
});

test.describe("Daily Journal Highlight", () => {
  test("creates a single-paragraph highlight on a daily journal entry reflected in content editable and entry highlights list", async ({
    page,
  }) => {
    const paragraphText =
      "Tonight, under the serene glow of the full moon, I sit by the riverbank, feeling the soft caress of the cool breeze. The murmurs of the flowing water create a symphony that resonates with the depths of my soul. It has been a day of profound contemplation, one that has stirred the depths of my being and ignited within me a thirst for knowledge and understanding.";

    const todayEntryKey = new IpsumDateTime(getCurrentLocalDateTime()).toString(
      "entry-printed-date"
    );

    const contentEditable = await page.getByTestId(`editor-${todayEntryKey}`);

    await contentEditable.fill(paragraphText);

    // Wait for entry debounce.
    await page.waitForTimeout(1000);

    await contentEditable.press("Meta+a");

    await page.waitForTimeout(1000);

    const formattingControlsHighlightButton = await page.getByTestId(
      TestIds.FormattingControls.HighlightButton
    );

    await formattingControlsHighlightButton.click();

    const highlightsList = await page.getByTestId(TestIds.Entry.HighlightsList);

    await expect(highlightsList).toBeVisible();

    const paragraphSpan = await contentEditable.locator("[data-highlight-id]");

    await expect(paragraphSpan).toBeVisible();
    await expect(paragraphSpan).toHaveText(paragraphText);
  });

  test("removes a highlight from highlights entry list when the highlight is deleted from the content editable", async ({
    page,
  }) => {
    const paragraphText =
      "Tonight, under the serene glow of the full moon, I sit by the riverbank, feeling the soft caress of the cool breeze. The murmurs of the flowing water create a symphony that resonates with the depths of my soul. It has been a day of profound contemplation, one that has stirred the depths of my being and ignited within me a thirst for knowledge and understanding.";

    const todayEntryKey = new IpsumDateTime(getCurrentLocalDateTime()).toString(
      "entry-printed-date"
    );

    const contentEditable = await page.getByTestId(`editor-${todayEntryKey}`);

    await contentEditable.fill(paragraphText);

    // Wait for entry debounce.
    await page.waitForTimeout(1000);

    await contentEditable.press("Meta+a");

    await page.waitForTimeout(1000);

    const formattingControlsHighlightButton = await page.getByTestId(
      TestIds.FormattingControls.HighlightButton
    );

    await formattingControlsHighlightButton.click();

    const highlightsList = await page.getByTestId(TestIds.Entry.HighlightsList);
    const highlightTags = await highlightsList
      .getByTestId(TestIds.HighlightTag.HighlightTag)
      .all();

    await expect(highlightTags).toHaveLength(1);

    const paragraphSpan = await contentEditable.locator("[data-highlight-id]");

    await paragraphSpan.press("Meta+a");
    await page.keyboard.press("Delete");

    await page.waitForTimeout(1000);

    await expect(highlightTags).toHaveLength(1);
  });
});
