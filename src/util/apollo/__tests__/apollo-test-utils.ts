import { UnhydratedType, vars } from "../client";

export const mockJournalMetadata = (
  metadata: UnhydratedType["JournalMetadata"]
) => {
  vars.journalMetadata(metadata);
};

export const mockEntries = (entries: {
  [entryKey in string]: UnhydratedType["Entry"];
}) => {
  vars.entries(entries);
};

export const mockArcs = (arcs: { [id in string]: UnhydratedType["Arc"] }) => {
  vars.arcs(arcs);
};

export const mockHighlights = (highlight: {
  [id in string]: UnhydratedType["Highlight"];
}) => {
  vars.highlights(highlight);
};
