import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { getHighlightOrder } from "util/excerpt";

import { ProjectState } from "../project-state";
import { InMemoryHighlight } from "../types";
import { ObjectWrapper } from "./object-wrapper";

export class HighlightWrapper extends ObjectWrapper {
  private highlight: InMemoryHighlight;

  constructor(highlight: InMemoryHighlight, projectState: ProjectState) {
    super(projectState);
    this.highlight = highlight;
  }

  get number() {
    const entry = this.projectState
      .collection("entries")
      .get(this.highlight.entry);

    if (!entry) {
      throw new Error("Entry not found for highlight");
    }

    const domString = IpsumTimeMachine.fromString(
      entry.trackedHTMLString
    ).currentValue;
    const highlightOrder = getHighlightOrder(domString);

    return highlightOrder.findIndex((id) => id === this.highlight.id) + 1;
  }

  get hue() {
    const entry = this.projectState
      .collection("entries")
      .get(this.highlight.entry);

    if (!entry) {
      return null;
    }

    const entryDay = IpsumDay.fromString(entry.history.dateCreated, "iso");
    const dayOfYear = entryDay.toLuxonDateTime().ordinal;

    const number = this.number + dayOfYear;

    const goldenRatioConjugate = 0.618033988749895;

    const hue = ((number * goldenRatioConjugate) % 1.0) * 360;

    return hue;
  }

  get objectText() {
    const entry = this.projectState
      .collection("entries")
      .get(this.highlight.entry);

    if (!entry) {
      throw new Error("Entry not found for highlight");
    }

    switch (entry.entryType) {
      case "JOURNAL":
        return IpsumDay.fromString(entry.history.dateCreated, "iso").toString(
          "entry-printed-date"
        );
      case "ARC":
        return entry.entryKey.split(":")[1] ?? "(arc not found)";
    }
  }
}
