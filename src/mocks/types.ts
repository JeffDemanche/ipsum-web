import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state/project";

export interface GeneratedMock {
  projectState: ProjectState;
}

export interface MockedRelationToArc {
  id: string;
  predicate: string;
  arcId: string;
}

export interface MockedHighlight {
  id: string;
  hue: number;
  entryKey: string;
  comments?: MockedComment[];
  outgoingRelations?: MockedRelationToArc[];
}

export type MockableTag = "p" | "h1" | "h2";

export type MockedEntrySection =
  | {
      text: string;
      tag?: MockableTag;
      highlight?: MockedHighlight;
    }
  | string;

export type MockedEntry = {
  entryKey: string;
  sections: MockedEntrySection[];
};

export interface ProcessedEntrySections {
  htmlString: string;
  highlights: MockedHighlight[];
}

export interface MockedComment {
  id: string;
  highlightId: string;
  mockedEntry: MockedEntry;
  dayCreated: IpsumDay;
}

export interface MockedArc {
  id: string;
  name: string;
  hue: number;
  arcEntry?: MockedEntry;
}
