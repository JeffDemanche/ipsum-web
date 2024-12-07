interface ExcerptOptions {
  entryDomString: string;
  highlightId: string;
  highlightHue: number;

  worldLimit?: number;
}

export const removeNonHighlightChildren = (
  element: HTMLElement,
  highlightId: string,
  highlightHue: number
): HTMLElement => {
  if (element.getAttribute?.("data-highlight-id")?.includes(highlightId)) {
    const highlightElement = element.cloneNode(true) as HTMLElement;
    highlightElement.style.setProperty("--hue", `${highlightHue}`);
    highlightElement.style.setProperty("--lightness", "50%");
    highlightElement.classList.add("ipsum-highlight");
    return highlightElement;
  } else if (!element.hasChildNodes()) {
    return null;
  } else {
    const newElement = element.cloneNode(false) as HTMLElement;
    element.childNodes.forEach((child) => {
      const newChild = removeNonHighlightChildren(
        child as HTMLElement,
        highlightId,
        highlightHue
      );
      if (newChild) newElement.appendChild(newChild);
    });
    if (newElement.hasChildNodes()) return newElement;
    else return null;
  }
};

export const excerptDivString = ({
  entryDomString,
  highlightId,
  highlightHue,
}: ExcerptOptions) => {
  const div = document.createElement("div");
  div.innerHTML = entryDomString;
  div.classList.add("ipsum-excerpt");

  const truncatedDiv =
    removeNonHighlightChildren(div, highlightId, highlightHue) ?? div;

  return truncatedDiv.outerHTML;
};
