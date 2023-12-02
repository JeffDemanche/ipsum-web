import { test, expect } from "@playwright/test";
import { getCurrentLocalDateTime, IpsumDateTime } from "util/dates";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:9000/journal/");
});

const removeUUIDs = (text: string) => {
  return text.replace(
    /[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/gi,
    "00000000-0000-0000-0000-000000000000"
  );
};

const unIndentAndNewLine = (text: string) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("");
};

test.describe("Text Highlights", () => {
  test("highlights a single letter at the end of the entry", async ({
    page,
  }) => {
    const todayEntryKey = new IpsumDateTime(getCurrentLocalDateTime()).toString(
      "entry-printed-date"
    );

    const contentEditable = await page.getByTestId(`editor-${todayEntryKey}`);

    await contentEditable.fill("This is a test");

    await page.keyboard.down("Shift");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.up("Shift");

    const applyHighlightButton = await page.getByTestId(
      "apply-highlight-button"
    );
    await applyHighlightButton.click();

    await expect(removeUUIDs(await contentEditable.innerHTML())).toEqual(
      removeUUIDs(
        unIndentAndNewLine(`
          <p dir="ltr">
            <span data-lexical-text="true">This is a tes</span>
              <span data-highlight-id="7d71efbf-fed3-497a-a006-42eeee59feae" class="HighlightAssignmentPlugin__highlight___XN157" dir="ltr" style="--lightness: 0%;">
              <span data-lexical-text="true">t</span>
            </span>
          </p>
        `)
      )
    );
  });

  test("applies two highlights to the same word", async ({ page }) => {
    const todayEntryKey = new IpsumDateTime(getCurrentLocalDateTime()).toString(
      "entry-printed-date"
    );

    const contentEditable = await page.getByTestId(`editor-${todayEntryKey}`);

    await contentEditable.fill("123");

    await page.keyboard.down("Shift");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.up("Shift");

    const applyHighlightButton = await page.getByTestId(
      "apply-highlight-button"
    );
    await applyHighlightButton.click();

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.down("Shift");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.up("Shift");

    await applyHighlightButton.click();

    await expect(removeUUIDs(await contentEditable.innerHTML())).toEqual(
      removeUUIDs(
        unIndentAndNewLine(`
          <p>
            <span data-lexical-text="true">1</span>
            <span data-highlight-id="00000000-0000-0000-0000-000000000000" class="HighlightAssignmentPlugin__highlight___XN157" style="--lightness: 0%;">
              <span data-lexical-text="true">2</span>
            </span>
            <span data-highlight-id="00000000-0000-0000-0000-000000000000" class="HighlightAssignmentPlugin__highlight___XN157" style="--lightness: 0%;">
              <span data-lexical-text="true">3</span>
            </span>
          </p>
        `)
      )
    );
  });

  test("applies partially overlapping highlight", async ({ page }) => {
    const todayEntryKey = new IpsumDateTime(getCurrentLocalDateTime()).toString(
      "entry-printed-date"
    );

    const contentEditable = await page.getByTestId(`editor-${todayEntryKey}`);

    await contentEditable.fill("123");

    // Select 1[23]
    await page.keyboard.down("Shift");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.up("Shift");

    const applyHighlightButton = await page.getByTestId(
      "apply-highlight-button"
    );
    await applyHighlightButton.click();

    // Select [12]3
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.down("Shift");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.up("Shift");

    await applyHighlightButton.click();

    await expect(removeUUIDs(await contentEditable.innerHTML())).toEqual(
      removeUUIDs(
        unIndentAndNewLine(`
          <p>
            <span data-lexical-text="true">1</span>
            <span data-highlight-id="00000000-0000-0000-0000-000000000000" class="HighlightAssignmentPlugin__highlight___XN157" style="--lightness: 0%;">
              <span data-lexical-text="true">2</span>
            </span>
            <span data-highlight-id="00000000-0000-0000-0000-000000000000" class="HighlightAssignmentPlugin__highlight___XN157" style="--lightness: 0%;">
              <span data-lexical-text="true">3</span>
            </span>
          </p>
        `)
      )
    );
  });
});
