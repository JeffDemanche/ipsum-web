import { expect, test } from "@playwright/test";
import { getCurrentLocalDateTime, IpsumDateTime, IpsumDay } from "util/dates";
import { TestIds } from "util/test-ids";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:9000/journal/");
});

test.describe("Daily Journal", () => {
  test.describe("Today's entry", () => {
    test("creates, updates, deletes today entry", async ({ page }) => {
      const todayEntryKey = new IpsumDateTime(
        getCurrentLocalDateTime()
      ).toString("entry-printed-date");

      const contentEditable = await page.getByTestId(`editor-${todayEntryKey}`);

      await contentEditable.fill("This is a test");

      // Wait for entry debounce.
      await page.waitForTimeout(1000);

      const todayNavButton = await page.getByTestId(
        TestIds.DailyJournal.MonthlyNavEntryButton(
          IpsumDay.fromString(todayEntryKey, "stored-day").toString("day")
        )
      );

      await expect(todayNavButton).toBeVisible();

      await contentEditable.press("Meta+a");
      await page.keyboard.press("Delete");

      await page.waitForTimeout(1000);

      await expect(todayNavButton).not.toBeVisible();
    });
  });
});
