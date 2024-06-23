import {
  MockableTag,
  MockedComment,
  MockedEntry,
  MockedEntrySection,
  MockedHighlight,
  ProcessedEntrySections,
} from "./types";

export const wrapSectionWithTag = (
  section: string,
  tag: MockableTag
): string => {
  return `<${tag}>${section}</${tag}>`;
};

export const wrapSectionWithHighlight = (
  section: string,
  highlightId: string,
  highlightHue: number
): string => {
  return `<span data-highlight-id="${highlightId}" data-hue="${highlightHue}" class="ipsum-highlight" style="--hue: 263; --lightness: 50%;">${section}</span>`;
};

export const processEntrySections = (
  mockedEntry: MockedEntry
): ProcessedEntrySections => {
  const highlights: MockedHighlight[] = [];

  const htmlString = mockedEntry.sections
    .map((section) => {
      if (typeof section === "string") {
        return wrapSectionWithTag(section, "p");
      } else {
        let wrappedSection = section.text;
        if (section.highlight) {
          wrappedSection = wrapSectionWithHighlight(
            section.text,
            section.highlight.id,
            section.highlight.hue
          );
          highlights.push(section.highlight);
        }
        wrappedSection = wrapSectionWithTag(wrappedSection, section.tag ?? "p");
        return wrappedSection;
      }
    })
    .join("");

  return { htmlString, highlights };
};
