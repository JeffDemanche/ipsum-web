export const wrapWithCommentDiv = (
  htmlString: string,
  options: { commentId: string }
): string => {
  return `<div data-comment-id="${options.commentId}">${htmlString}</div>`;
};

/**
 * Given an entry htmlString, finds the first div with a data-comment-id
 * attribute matching the provided commentId and replaces its contents with
 * the newCommentHtmlString. Also deletes any subsequent divs with the same
 * data-comment-id attribute.
 */
export const replaceCommentDiv = (
  entryHtmlString: string,
  newCommentHtmlString: string,
  commentId: string
) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(entryHtmlString, "text/html");

  const commentDivs = doc.querySelectorAll(
    `div[data-comment-id="${commentId}"]`
  );

  if (commentDivs.length === 0) {
    throw new Error(`No comment div found with commentId ${commentId}`);
  }

  const firstCommentDiv = commentDivs[0];
  firstCommentDiv.innerHTML = newCommentHtmlString;

  for (let i = 1; i < commentDivs.length; i++) {
    const commentDiv = commentDivs[i];
    commentDiv.remove();
  }

  return doc.body.innerHTML;
};
