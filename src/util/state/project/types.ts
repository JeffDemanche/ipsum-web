import type { ReactiveVar } from "@apollo/client";
import type { ValidatorResult } from "util/serializer";

import type { ProjectCollection } from "./project-collection";
import type { ProjectState } from "./project-state";

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
  incomingRelations: string[];
  outgoingRelations: string[];
  importanceRatings: InMemoryImportanceRating[];
  comments: string[];
  srsCard?: string;
}

export interface InMemoryRelation {
  __typename: "Relation";
  id: string;
  subjectType: "Arc" | "Highlight" | "Comment";
  subject: string;
  predicate: string;
  objectType: "Arc" | "Highlight";
  object: string;
}

export interface InMemoryDay {
  __typename: "Day";
  day: string;
  journalEntry?: string;
  ratedHighlights: string[];
  changedArcEntries: string[];
  comments: string[];
  srsCardsReviewed: string[];
}

export interface InMemoryComment {
  __typename: "Comment";
  id: string;
  parent: string | null;
  objectHighlight: string;
  outgoingRelations: string[];
  commentEntry: string;
  history: InMemoryHistory;
}

export interface InMemorySRSCardReview {
  __typename: "SRSCardReview";
  day: string;
  rating: number;
  easeBefore: number;
  easeAfter: number;
  intervalBefore: number;
  intervalAfter: number;
}

export interface InMemorySRSCard {
  __typename: "SRSCard";
  id: string;
  history: InMemoryHistory;
  subjectType: "Highlight";
  subject: string;
  reviews: InMemorySRSCardReview[];
}

export interface ReactiveInMemoryProjectSingletons {
  projectVersion: ReactiveVar<string>;
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
  srsCards: ProjectCollection<InMemorySRSCard>;
}

export interface ReactiveInMemoryProjectState {
  singletons: ReactiveInMemoryProjectSingletons;
  collections: ReactiveInMemoryProjectCollections;
}

type CollectionOf<T> = Record<string, T>;

export type SingletonKey = "journalId" | "journalTitle" | "journalMetadata";

export interface StaticInMemoryProjectState {
  projectVersion: string;
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
  srsCards: CollectionOf<InMemorySRSCard>;
}

export type DeserializationResult =
  | { result: "success"; state: ProjectState }
  | { result: "parse_error"; messages: string[] }
  | {
      result: "validator_error";
      validator: ValidatorResult;
    };
