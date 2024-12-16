import { isEmptyHTMLString, replaceHighlightHtmlWith } from "../excerpt";

describe("Excerpt", () => {
  describe("replaceHighlightHtmlWith", () => {
    it("should replace the first highlight with the replacement string", () => {
      const originalHtmlString = `
        <p><span data-highlight-id="1">First</span></p>
        <p><span data-highlight-id="2">Second</span></p>
      `;

      const replaceWithHtmlString =
        '<p><span data-highlight-id="1">New First</span></p>';

      expect(
        replaceHighlightHtmlWith(originalHtmlString, replaceWithHtmlString, "1")
      ).toEqual(`
        <p><span data-highlight-id="1">New First</span></p>
        <p><span data-highlight-id="2">Second</span></p>
      `);
    });

    it("should replace multi-block highlights with the replacement string", () => {
      const originalHtmlString = `
        <p><span data-highlight-id="1">First</span></p>
        <p><span data-highlight-id="1">Second</span></p>
        <p><span data-highlight-id="2">Third</span></p>
      `;

      const replaceWithHtmlString =
        '<p><span data-highlight-id="1">New First</span></p>';

      expect(
        replaceHighlightHtmlWith(
          originalHtmlString,
          replaceWithHtmlString,
          "1"
        ).replace(/\s+/g, "")
      ).toEqual(
        `
        <p><span data-highlight-id="1">New First</span></p>
        <p><span data-highlight-id="2">Third</span></p>
      `.replace(/\s+/g, "")
      );
    });

    it("should replace a list where every element belongs to the highlight", () => {
      const originalHtmlString = `
        <ul>
          <li><span data-highlight-id="1">First</span></li>
          <li><span data-highlight-id="1">Second</span></li>
        </ul>
      `;

      const replaceWithHtmlString =
        '<ul><li><span data-highlight-id="1">New First</span></li></ul>';

      expect(
        replaceHighlightHtmlWith(originalHtmlString, replaceWithHtmlString, "1")
      ).toEqual(`
        <ul><li><span data-highlight-id="1">New First</span></li></ul>
      `);
    });
  });

  describe("isEmptyHTMLString", () => {
    it.each([
      ["<p></p>", true],
      ["<p> </p>", false],
      ["<p><br></p>", true],
      ["<p><br> </p>", false],
      ["<p><br> <br></p>", false],
      ["<p>Text</p>", false],
      ["<p>Text <br></p>", false],
      ["<p><br> Text</p>", false],
      ["<p>Text <br> Text</p>", false],
    ])("should return %s as %s", (htmlString: string, expected: boolean) => {
      expect(isEmptyHTMLString(htmlString)).toBe(expected);
    });
  });
});
