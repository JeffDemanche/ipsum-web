import { IpsumDateTime } from "util/dates";

export default function fillHighlightDateCreated(data: any) {
  const highlights = Object.keys(data.highlights);

  highlights.forEach((key: any) => {
    const highlight = data.highlights[key];
    if (!highlight.history.dateCreated) {
      const entryKey = highlight.entry;
      console.log(
        "Setting dateCreated for highlight",
        key,
        "from entry",
        entryKey
      );
      highlight.history.dateCreated = IpsumDateTime.fromString(
        entryKey,
        "entry-printed-date"
      ).toString("iso");
    }
    highlights[key] = highlight;
  });
}
