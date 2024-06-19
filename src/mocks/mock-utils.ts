export const paragraphArrayToHtmlString = (paragraphs: string[]): string => {
  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
};
