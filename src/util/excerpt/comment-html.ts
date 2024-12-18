export const wrapWithCommentDiv = (
  htmlString: string,
  options: {
    commentId: string;
    highlightHue: number;
    highlightNumber: number;
    highlightObjectText: string;
  }
): string => {
  const hueString = options.highlightHue
    ? ` data-hue="${options.highlightHue}"`
    : "";
  const numberString = options.highlightNumber
    ? ` data-number="${options.highlightNumber}"`
    : "";
  const objectTextString = options.highlightObjectText
    ? ` data-object-text="${options.highlightObjectText}"`
    : "";
  return `<div data-comment-id="${options.commentId}"${hueString}${numberString}${objectTextString}>${htmlString}</div>`;
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

export const removeEmptyCommentDivs = (htmlString: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const commentDivs = doc.querySelectorAll("div[data-comment-id]");

  commentDivs.forEach((commentDiv) => {
    if (commentDiv.textContent === "") {
      commentDiv.remove();
    }
  });

  return doc.body.innerHTML;
};

/**
 * Gets the innerHTML of the first div with a data-comment-id attribute
 */
export const excerptCommentDivString = (
  htmlString: string,
  commentId: string
): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const commentDiv = doc.querySelector(`div[data-comment-id="${commentId}"`);

  if (!commentDiv) {
    throw new Error(`No comment div found with commentId ${commentId}`);
  }
  return commentDiv.innerHTML;
};

export const removeCommentDiv = (
  htmlString: string,
  commentId: string
): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const commentDivs = doc.querySelectorAll(
    `div[data-comment-id="${commentId}"`
  );

  commentDivs.forEach((commentDiv) => {
    commentDiv.remove();
  });

  return doc.body.innerHTML;
};
