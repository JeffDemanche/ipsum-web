import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:9000/journal/");
});

test.describe("Relations Table", () => {
  test.describe("on highlight blurb", () => {});
});
