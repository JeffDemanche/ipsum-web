import { expect, test } from "@playwright/test";
import { TestIds } from "util/test-ids";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:9000/journal/?siddhartha");
});

test.describe("Arc Page Relations", () => {
  test("single add relation link button appears on arc page, which opens relation chooser popover", async ({
    page,
  }) => {
    const drawer = page.getByTestId(TestIds.BrowserDrawer.BrowserDrawerOpened);

    const firstHighlightBlurb = drawer
      .getByTestId(TestIds.HighlightBlurb.HighlightBlurb)
      .first();

    await expect(firstHighlightBlurb).toBeVisible();

    await firstHighlightBlurb.click();

    const arcTagLink = page.getByTestId(TestIds.ArcTag.LinkButton);

    await expect(arcTagLink).toBeVisible();

    await arcTagLink.click();

    const arcPage = page.getByTestId(TestIds.ArcPage.ArcPage);

    await expect(arcPage).toBeVisible();

    const emptyRelationsTableAddLinkButton = page.getByTestId(
      TestIds.RelationsTable.EmptyTableAddLinkButton
    );

    await expect(emptyRelationsTableAddLinkButton).toBeVisible();

    await emptyRelationsTableAddLinkButton.click();

    const relationChooser = page.getByTestId(
      TestIds.RelationChooser.RelationChooser
    );

    await expect(relationChooser).toBeVisible();
  });

  test("creating a relation from relation chooser adds relation to relations table and closes popover", async ({
    page,
  }) => {
    const drawer = page.getByTestId(TestIds.BrowserDrawer.BrowserDrawerOpened);

    const firstHighlightBlurb = drawer
      .getByTestId(TestIds.HighlightBlurb.HighlightBlurb)
      .first();

    await firstHighlightBlurb.click();

    const arcTagLink = page.getByTestId(TestIds.ArcTag.LinkButton);

    await arcTagLink.click();

    const arcPage = page.getByTestId(TestIds.ArcPage.ArcPage);

    const emptyRelationsTableAddLinkButton = arcPage.getByTestId(
      TestIds.RelationsTable.EmptyTableAddLinkButton
    );

    await emptyRelationsTableAddLinkButton.click();

    const relationChooser = page.getByTestId(
      TestIds.RelationChooser.RelationChooser
    );

    const relationChooserTextField = relationChooser.getByTestId(
      TestIds.RelationChooser.ArcSearchField
    );

    await relationChooserTextField.getByRole("textbox").fill("Banyan Tree");

    const firstArcSearchResult = relationChooser
      .getByTestId(TestIds.ArcTag.ArcTag)
      .first();

    await expect(firstArcSearchResult).toBeVisible();

    await expect(firstArcSearchResult).toHaveText("Banyan Tree (new)");

    await firstArcSearchResult.click();

    await expect(relationChooser).not.toBeVisible();

    const relationsTable = arcPage.getByTestId(
      TestIds.RelationsTable.RelationsTable
    );

    const predicateRow = relationsTable.getByTestId(
      TestIds.RelationsTable.PredicateRow
    );

    const predicateRowArcTag = predicateRow.getByTestId(TestIds.ArcTag.ArcTag);

    await expect(predicateRow).toContainText("relates to");
    await expect(predicateRowArcTag).toBeVisible();
    await expect(predicateRowArcTag).toHaveText("Banyan Tree");
  });
});
