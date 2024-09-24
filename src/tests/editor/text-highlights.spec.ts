import { expect, test } from "@playwright/test";
import { getCurrentLocalDateTime, IpsumDateTime } from "util/dates";
import { TestIds } from "util/test-ids";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:9000/journal/");
});

const removeWildcards = (text: string) => {
  return text
    .replace(
      /[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/gi,
      "00000000-0000-0000-0000-000000000000"
    )
    .replace(/class\s*=\s*["']([^"']*)["']/, 'class="."');
};

const unIndentAndNewLine = (text: string) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("");
};

test.describe("Text Highlights", () => {
  test.describe("Lexical Functionality", () => {
    test("highlights a single letter at the end of the entry", async ({
      page,
    }) => {
      const todayEntryKey = new IpsumDateTime(
        getCurrentLocalDateTime()
      ).toString("entry-printed-date");

      const contentEditable = page.getByTestId(`editor-${todayEntryKey}`);

      await contentEditable.fill("This is a test");

      // Wait for entry debounce.
      await page.waitForTimeout(1000);

      await page.keyboard.down("Shift");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.up("Shift");

      const applyHighlightButton = page.getByTestId(
        TestIds.FormattingControls.HighlightButton
      );
      await applyHighlightButton.click();

      const highlightSpan = contentEditable.locator("[data-highlight-id]");

      await expect(highlightSpan).toHaveText("t");
      await expect(highlightSpan).toHaveAttribute("data-hue");
      await expect(highlightSpan).toHaveClass("ipsum-highlight");
    });

    test("applies two highlights to the same word", async ({ page }) => {
      const todayEntryKey = new IpsumDateTime(
        getCurrentLocalDateTime()
      ).toString("entry-printed-date");

      const contentEditable = page.getByTestId(`editor-${todayEntryKey}`);

      await contentEditable.fill("123");

      // Wait for entry debounce.
      await page.waitForTimeout(1000);

      await page.keyboard.down("Shift");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.up("Shift");

      const applyHighlightButton = page.getByTestId(
        TestIds.FormattingControls.HighlightButton
      );
      await applyHighlightButton.click();

      await contentEditable.focus();

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.down("Shift");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.up("Shift");

      await applyHighlightButton.click();

      const highlightSpans = await contentEditable
        .locator("[data-highlight-id]")
        .all();

      await expect(highlightSpans).toHaveLength(2);
      await expect(highlightSpans[0]).toHaveText("2");
      await expect(highlightSpans[1]).toHaveText("3");
    });

    test("applies two highlights to the same text", async ({ page }) => {
      const todayEntryKey = new IpsumDateTime(
        getCurrentLocalDateTime()
      ).toString("entry-printed-date");

      const contentEditable = page.getByTestId(`editor-${todayEntryKey}`);

      await contentEditable.fill("12345");

      // Wait for entry debounce.
      await page.waitForTimeout(1000);

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.down("Shift");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.up("Shift");

      const applyHighlightButton = page.getByTestId(
        TestIds.FormattingControls.HighlightButton
      );

      await applyHighlightButton.click();

      await contentEditable.focus();

      await applyHighlightButton.click();

      const highlightSpans = await contentEditable
        .locator("[data-highlight-id]")
        .all();

      expect(highlightSpans).toHaveLength(2);
      await expect(highlightSpans[0]).toHaveText("234");
      await expect(highlightSpans[1]).toHaveText("234");

      const highlight1Id =
        await highlightSpans[0].getAttribute("data-highlight-id");
      const highlight2Id =
        await highlightSpans[1].getAttribute("data-highlight-id");

      expect(highlight1Id).not.toEqual(highlight2Id);
    });

    test("applies highlight across multiple paragraphs", async ({ page }) => {
      const todayEntryKey = new IpsumDateTime(
        getCurrentLocalDateTime()
      ).toString("entry-printed-date");

      const contentEditable = page.getByTestId(`editor-${todayEntryKey}`);

      await contentEditable.pressSequentially("line 1");

      await contentEditable.press("Enter");

      await contentEditable.pressSequentially("line 2");

      // Wait for entry debounce.
      await page.waitForTimeout(1000);

      await page.keyboard.down("Meta");
      await page.keyboard.press("A");
      await page.keyboard.up("Meta");

      const applyHighlightButton = page.getByTestId(
        TestIds.FormattingControls.HighlightButton
      );
      await applyHighlightButton.click();

      const highlightSpans = await contentEditable
        .locator("[data-highlight-id]")
        .all();

      expect(highlightSpans).toHaveLength(2);
      await expect(highlightSpans[0]).toHaveText("line 1");
      await expect(highlightSpans[1]).toHaveText("line 2");

      const highlight1Id =
        await highlightSpans[0].getAttribute("data-highlight-id");
      const highlight2Id =
        await highlightSpans[1].getAttribute("data-highlight-id");

      expect(highlight1Id).toEqual(highlight2Id);
    });

    test("applies partially overlapping highlight", async ({ page }) => {
      const todayEntryKey = new IpsumDateTime(
        getCurrentLocalDateTime()
      ).toString("entry-printed-date");

      const contentEditable = page.getByTestId(`editor-${todayEntryKey}`);

      await contentEditable.fill("123");

      // Wait for entry debounce.
      await page.waitForTimeout(1000);

      // Select 1[23]
      await page.keyboard.down("Shift");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.up("Shift");

      const applyHighlightButton = page.getByTestId(
        TestIds.FormattingControls.HighlightButton
      );

      await applyHighlightButton.click();

      // Select [12]3
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.down("Shift");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.up("Shift");

      await applyHighlightButton.click();

      const highlightSpans = await contentEditable
        .locator("[data-highlight-id]")
        .all();

      expect(highlightSpans).toHaveLength(3);
      await expect(highlightSpans[0]).toHaveText("1");
      await expect(highlightSpans[1]).toHaveText("23");
      await expect(highlightSpans[2]).toHaveText("2");

      const highlight1Id =
        await highlightSpans[0].getAttribute("data-highlight-id");
      const highlight2Id =
        await highlightSpans[1].getAttribute("data-highlight-id");
      const highlight3Id =
        await highlightSpans[2].getAttribute("data-highlight-id");

      expect(highlight1Id).toEqual(highlight3Id);
      expect(highlight1Id).not.toEqual(highlight2Id);
    });

    test("applies highlight to a word with formatting", async ({ page }) => {
      const todayEntryKey = new IpsumDateTime(
        getCurrentLocalDateTime()
      ).toString("entry-printed-date");

      const contentEditable = page.getByTestId(`editor-${todayEntryKey}`);

      await contentEditable.press("Meta+b");
      await contentEditable.pressSequentially("12");
      await contentEditable.press("Meta+b");
      await contentEditable.pressSequentially("3");
      await contentEditable.press("Meta+i");
      await contentEditable.pressSequentially("45");

      // Wait for entry debounce.
      await page.waitForTimeout(1000);

      await contentEditable.press("Meta+a");

      const applyHighlightButton = page.getByTestId(
        TestIds.FormattingControls.HighlightButton
      );

      await applyHighlightButton.click();

      const highlightSpan = contentEditable.locator("[data-highlight-id]");

      await expect(highlightSpan).toHaveText("12345");
      const boldText = highlightSpan.locator("strong");

      await expect(boldText).toHaveText("12");

      const italicText = highlightSpan.locator("em");

      await expect(italicText).toHaveText("45");
    });
  });
});
