import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { gql } from "util/apollo";
import { highlightSpanClassname } from "util/editor";

export const UseExcerptQuery = gql(`
  query UseExcerptQuery($highlightId: ID!) {
    highlights(ids: [$highlightId]) {
      id
      entry {
        entryKey
        htmlString
      }
      hue
    }
  }
`);

export const useExcerpt = ({
  highlightId,
  charLimit,
}: {
  highlightId: string;
  charLimit?: number;
}) => {
  const {
    data: { highlights },
  } = useQuery(UseExcerptQuery, {
    variables: { highlightId },
  });

  const domString = highlights[0]?.entry?.htmlString ?? "";

  const hue = highlights[0]?.hue ?? 0;

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const div = document.createElement("div");
    div.innerHTML = domString;

    const removeNonHighlightChildren = (element: HTMLElement): HTMLElement => {
      if (element.getAttribute?.("data-highlight-id")?.includes(highlightId)) {
        const highlightElement = element.cloneNode(true) as HTMLElement;
        highlightElement.style.setProperty("--hue", `${hue}`);
        highlightElement.style.setProperty("--lightness", "50%");
        highlightElement.classList.add(highlightSpanClassname);
        return highlightElement;
      } else if (!element.hasChildNodes()) {
        return null;
      } else {
        const newElement = element.cloneNode(false) as HTMLElement;
        element.childNodes.forEach((child) => {
          const newChild = removeNonHighlightChildren(child as HTMLElement);
          if (newChild) newElement.appendChild(newChild);
        });
        if (newElement.hasChildNodes()) return newElement;
        else return null;
      }
    };

    const truncatedDiv = removeNonHighlightChildren(div) ?? div;

    if (ref.current) ref.current.innerHTML = "";
    ref?.current?.appendChild(truncatedDiv);
  }, [domString, highlightId, hue]);

  return { ref };
};
