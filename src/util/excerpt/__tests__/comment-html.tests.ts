import { replaceCommentDiv } from "../comment-html";

describe("comment-html", () => {
  describe("replaceCommentDiv", () => {
    it("correct when there's one a comment div", () => {
      expect(
        replaceCommentDiv(
          '<div data-comment-id="comment-id">htmlString</div>',
          "newCommentHtmlString",
          "comment-id"
        )
      ).toBe('<div data-comment-id="comment-id">newCommentHtmlString</div>');
    });

    it("correct when there's a comment div in the middle", () => {
      expect(
        replaceCommentDiv(
          '<h1>htmlString</h1><div data-comment-id="comment-id"><p>htmlString</p></div><p>htmlString</p>',
          "<span>newCommentHtmlString</span>",
          "comment-id"
        )
      ).toBe(
        '<h1>htmlString</h1><div data-comment-id="comment-id"><span>newCommentHtmlString</span></div><p>htmlString</p>'
      );
    });

    it("if there are two non-consecutive comment divs, it should replace the first one and delete the second", () => {
      expect(
        replaceCommentDiv(
          '<div data-comment-id="comment-id">htmlString</div><p>something in between</p><div data-comment-id="comment-id">htmlString</div>',
          "newCommentHtmlString",
          "comment-id"
        )
      ).toBe(
        '<div data-comment-id="comment-id">newCommentHtmlString</div><p>something in between</p>'
      );
    });
  });
});
