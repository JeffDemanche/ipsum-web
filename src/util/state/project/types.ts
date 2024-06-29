import { ReactiveVar } from "@apollo/client";

import { ProjectCollection } from "./project-collection";

export interface InMemoryHistory {
  __typename: "History";
  dateCreated?: string;
}

export interface InMemoryJournalMetadata {
  __typename: "JournalMetadata";
  lastArcHue: number;
}

export interface InMemoryEntry {
  __typename: "Entry";
  entryKey: string;
  trackedHTMLString: string;
  history: InMemoryHistory;
  entryType: "JOURNAL" | "ARC" | "COMMENT";
}

export interface InMemoryJournalEntry {
  __typename: "JournalEntry";
  entryKey: string;
  entry: string;
}

export interface InMemoryArcEntry {
  __typename: "ArcEntry";
  entry: string;
  arc: string;
}

export interface InMemoryCommentEntry {
  __typename: "CommentEntry";
  entry: string;
  comment: string;
}

export interface InMemoryArc {
  __typename: "Arc";
  id: string;
  history: InMemoryHistory;
  arcEntry: string;
  name: string;
  color: number;
  incomingRelations: string[];
  outgoingRelations: string[];
}

export interface InMemoryImportanceRating {
  __typename: "ImportanceRating";
  day: string;
  value: number;
}

export interface InMemoryHighlight {
  __typename: "Highlight";
  id: string;
  history: InMemoryHistory;
  entry: string;
  outgoingRelations: string[];
  importanceRatings: InMemoryImportanceRating[];
  comments: string[];
}

export interface InMemoryRelation {
  __typename: "Relation";
  id: string;
  subjectType: "Arc" | "Highlight";
  subject: string;
  predicate: string;
  objectType: "Arc";
  object: string;
}

export interface InMemoryDay {
  __typename: "Day";
  day: string;
  journalEntry?: string;
  ratedHighlights: string[];
  changedArcEntries: string[];
  comments: string[];
}

export interface InMemoryComment {
  __typename: "Comment";
  id: string;
  parent: string | null;
  highlight: string;
  commentEntry: string;
  history: InMemoryHistory;
}

export interface ReactiveInMemoryProjectSingletons {
  journalId: ReactiveVar<string>;
  journalTitle: ReactiveVar<string>;
  journalMetadata: ReactiveVar<InMemoryJournalMetadata>;
}

export interface ReactiveInMemoryProjectCollections {
  entries: ProjectCollection<InMemoryEntry>;
  journalEntries: ProjectCollection<InMemoryJournalEntry>;
  arcEntries: ProjectCollection<InMemoryArcEntry>;
  commentEntries: ProjectCollection<InMemoryCommentEntry>;
  arcs: ProjectCollection<InMemoryArc>;
  highlights: ProjectCollection<InMemoryHighlight>;
  relations: ProjectCollection<InMemoryRelation>;
  comments: ProjectCollection<InMemoryComment>;
  days: ProjectCollection<InMemoryDay>;
}

export interface ReactiveInMemoryProjectState {
  singletons: ReactiveInMemoryProjectSingletons;
  collections: ReactiveInMemoryProjectCollections;
}

type CollectionOf<T> = Record<string, T>;

export type SingletonKey = "journalId" | "journalTitle" | "journalMetadata";

export interface StaticInMemoryProjectState {
  journalId: string;
  journalTitle: string;
  journalMetadata: InMemoryJournalMetadata;
  entries: CollectionOf<InMemoryEntry>;
  journalEntries: CollectionOf<InMemoryJournalEntry>;
  arcEntries: CollectionOf<InMemoryArcEntry>;
  commentEntries: CollectionOf<InMemoryCommentEntry>;
  arcs: CollectionOf<InMemoryArc>;
  highlights: CollectionOf<InMemoryHighlight>;
  relations: CollectionOf<InMemoryRelation>;
  comments: CollectionOf<InMemoryComment>;
  days: CollectionOf<InMemoryDay>;
}
