import { IpsumDay } from "util/dates";

export default function setHighlightDateCreated(data: any) {
  Object.keys(data.highlights).map((highlightId) => {
    const highlightEntry = data.entries[data.highlights[highlightId].entry];
    if (highlightEntry?.entryType === "JOURNAL") {
      const dayFromEntryKey = IpsumDay.fromString(
        highlightEntry.entryKey,
        "entry-printed-date"
      );
      const oldDate = data.highlights[highlightId].history.dateCreated;
      data.highlights[highlightId].history.dateCreated =
        dayFromEntryKey.toString("iso");

      console.log(
        `Set dateCreated for highlight ${highlightId}, old date: ${oldDate}, new date: ${dayFromEntryKey.toString("iso")}`
      );
    }
  });
}
