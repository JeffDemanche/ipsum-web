export const getHighlightOrder = (entryDomString: string): string[] => {
  const div = document.createElement("div");
  div.innerHTML = entryDomString;

  const highlightSpans = div.querySelectorAll("[data-highlight-id]");

  return Array.from(highlightSpans).map((span) =>
    span.getAttribute("data-highlight-id")
  );
};
