import { IpsumTimeMachine } from "util/diff";

export default function removeEmptyHighlights(data: any) {
  const entries = Object.keys(data.entries);

  entries.forEach((key) => {
    const trackedHTMLString = IpsumTimeMachine.fromString(
      data.entries[key].trackedHTMLString
    ).currentValue;
    const pattern = /data-highlight-id=['"]([^'"]+)['"]/g;

    const matches: string[] = [];

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(trackedHTMLString)) !== null) {
      matches.push(match[1]);
    }

    const entryHighlights = Object.values(data.highlights).filter(
      (highlight: any) => {
        return highlight.entry === key;
      }
    );

    entryHighlights.forEach((highlight: any) => {
      if (!matches.includes(highlight.id)) {
        delete data.highlights[highlight.id];
      }
    });
  });
}
