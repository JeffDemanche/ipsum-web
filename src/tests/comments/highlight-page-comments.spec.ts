import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { TestIds } from "util/test-ids";

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2020-01-01T08:00:00") });

  await page.goto("http://localhost:9000/journal/?siddhartha");
});

const createComment = async (page: Page) => {
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
};

test.describe("Highlight Page Comments", () => {
  test("writing a comment on a highlight adds it as a comment blurb to today's journal entry", async ({
    page,
  }) => {
    await createComment(page);

    const dailyJournalEntry = page.getByTestId(
      TestIds.DailyJournalEntry.DailyJournalEntry
    );

    const commentBlurbs = await dailyJournalEntry
      .getByTestId(TestIds.CommentBlurb.CommentBlurb)
      .all();

    expect(commentBlurbs).toHaveLength(1);

    const commentBlurbEditor = (await commentBlurbs)[0].getByTestId(
      TestIds.EntryEditor.EntryEditor
    );

    expect((await commentBlurbEditor.innerText()).trim()).toBe(
      "This is a comment"
    );
  });

  test("deleting a comment from the highlight page removes the blurb from today's journal entry", async ({
    page,
  }) => {
    await createComment(page);

    const highlightPage = page.getByTestId(TestIds.HighlightPage.HighlightPage);
    const highlightPageComments = highlightPage.getByTestId(
      TestIds.Comments.Comments
    );
    const contentEditable = highlightPageComments.getByTestId(
      TestIds.EntryEditor.ContentEditable
    );

    await contentEditable.press("Meta+a");

    await contentEditable.press("Backspace");

    await page.waitForTimeout(1000);

    const dailyJournalEntry = page.getByTestId(
      TestIds.DailyJournalEntry.DailyJournalEntry
    );
    const dailyJournalContentEditable = dailyJournalEntry.getByTestId(
      TestIds.EntryEditor.ContentEditable
    );

    const commentNode = await dailyJournalContentEditable
      .locator("[data-comment-id]")
      .all();

    expect(commentNode).toHaveLength(0);
  });
});
