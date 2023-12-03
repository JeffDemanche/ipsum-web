import { IpsumTimeMachine } from "util/diff";
import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html><body></div></body>`);
(global as any).window = dom.window;
(global as any).document = dom.window.document;

const separateHighlightIds = (html: string): string => {
  const parser = new window.DOMParser();
  const htmlDoc = parser.parseFromString(html, "text/html");
  let multiSpans = htmlDoc.querySelectorAll("[data-highlight-ids]");
  while (multiSpans.length > 0) {
    multiSpans.forEach((span) => {
      const highlightIds = span.getAttribute("data-highlight-ids");
      if (highlightIds) {
        const ids = highlightIds.split(",");
        ids.forEach((id) => {
          const newSpan = document.createElement("span");
          newSpan.setAttribute("data-highlight-id", id);
          newSpan.setAttribute("style", "--lightness: 0%;");
          newSpan.innerHTML = span.innerHTML;
          span.replaceWith(newSpan);
        });
      }
    });
    multiSpans = htmlDoc.querySelectorAll("[data-highlight-ids]");
  }
  console.log(htmlDoc.body.innerHTML);
  return htmlDoc.body.innerHTML;
};

export default function lexical(modifiedData: any) {
  const newEntries: { [key: string]: any } = {};

  Object.entries(modifiedData.entries).forEach(
    ([key, value]: [string, any]) => {
      const newEntry = { ...value };
      newEntry.trackedHTMLString = IpsumTimeMachine.create(
        separateHighlightIds(
          IpsumTimeMachine.fromString(value.trackedHTMLString).currentValue
        )
      ).toString();
      newEntries[key] = newEntry;
    }
  );

  modifiedData.entries = newEntries;
}
