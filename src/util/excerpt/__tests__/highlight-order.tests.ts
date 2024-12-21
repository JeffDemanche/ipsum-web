import { getHighlightOrder } from "../highlight-order";

describe("Highlight Order", () => {
  test("should get correct order with nested highlight spans", () => {
    const entryDomString = `
      <span data-highlight-id="1">
        <span data-highlight-id="2">
          <span data-highlight-id="3"></span>
        </span>
      </span>
    `;

    expect(getHighlightOrder(entryDomString)).toEqual(["1", "2", "3"]);
  });

  test("should get correct order with multiple highlight spans", () => {
    const entryDomString = `
      <p><span data-highlight-id="1">test</span></p>
      <p><span data-highlight-id="2">test</span></p>
      <p><span data-highlight-id="3">test</span></p>
    `;

    expect(getHighlightOrder(entryDomString)).toEqual(["1", "2", "3"]);
  });
});
