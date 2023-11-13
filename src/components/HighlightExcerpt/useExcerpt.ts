import { useEffect, useRef } from "react";

export const useExcerpt = ({
  domString,
  highlightId,
  charLimit,
}: {
  domString: string;
  highlightId: string;
  charLimit?: number;
}) => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const div = document.createElement("div");
    div.innerHTML = domString;

    const removeNonHighlightChildren = (element: HTMLElement): HTMLElement => {
      if (
        element
          .getAttribute?.("data-highlight-ids")
          ?.split(",")
          ?.includes(highlightId)
      ) {
        return element.cloneNode(true) as HTMLElement;
      } else if (!element.hasChildNodes()) {
        return null;
      } else {
        const newElement = element.cloneNode(false) as HTMLElement;
        element.childNodes.forEach((child) => {
          const newChild = removeNonHighlightChildren(child as HTMLElement);
          if (newChild) newElement.appendChild(newChild);
        });
        return newElement;
      }
    };

    const truncatedDiv = removeNonHighlightChildren(div) ?? div;

    if (ref.current) ref.current.innerHTML = "";
    ref?.current?.appendChild(truncatedDiv);
  }, [domString, highlightId]);

  return { ref };
};
