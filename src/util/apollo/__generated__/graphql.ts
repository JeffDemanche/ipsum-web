/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Arc = {
  __typename?: 'Arc';
  arcEntry: ArcEntry;
  color: Scalars['Int'];
  highlights: Array<Highlight>;
  history: History;
  id: Scalars['ID'];
  incomingRelations: Array<Relation>;
  name: Scalars['String'];
  outgoingRelations: Array<Relation>;
};

export type ArcEntry = {
  __typename?: 'ArcEntry';
  arc: Arc;
  entry: Entry;
};

export enum ArcSortType {
  AlphaAsc = 'ALPHA_ASC',
  AlphaDesc = 'ALPHA_DESC'
}

export type Comment = {
  __typename?: 'Comment';
  commentEntry: CommentEntry;
  history: History;
  id: Scalars['ID'];
};

export type CommentEntry = {
  __typename?: 'CommentEntry';
  comment: Comment;
  entry: Entry;
};

export type Day = {
  __typename?: 'Day';
  changedArcEntries?: Maybe<Array<ArcEntry>>;
  comments?: Maybe<Array<Comment>>;
  day: Scalars['String'];
  journalEntry?: Maybe<JournalEntry>;
  srsCardReviews?: Maybe<Array<SrsCardReview>>;
};

export type Entry = {
  __typename?: 'Entry';
  date: Scalars['String'];
  entryKey: Scalars['String'];
  entryType: EntryType;
  highlights: Array<Highlight>;
  history: History;
  htmlString: Scalars['String'];
  trackedHTMLString: Scalars['String'];
};

export enum EntryType {
  Arc = 'ARC',
  Comment = 'COMMENT',
  Journal = 'JOURNAL'
}

export type Highlight = {
  __typename?: 'Highlight';
  arc?: Maybe<Arc>;
  arcs: Array<Arc>;
  entry: Entry;
  history: History;
  hue: Scalars['Int'];
  id: Scalars['ID'];
  outgoingRelations: Array<Relation>;
  srsCards: Array<SrsCard>;
};

export type History = {
  __typename?: 'History';
  dateCreated?: Maybe<Scalars['String']>;
};

export type JournalEntry = {
  __typename?: 'JournalEntry';
  entry: Entry;
  entryKey: Scalars['String'];
};

export type JournalMetadata = {
  __typename?: 'JournalMetadata';
  lastArcHue: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  arc?: Maybe<Arc>;
  arcEntries?: Maybe<Array<Maybe<ArcEntry>>>;
  arcEntry?: Maybe<ArcEntry>;
  arcs?: Maybe<Array<Maybe<Arc>>>;
  entries?: Maybe<Array<Maybe<Entry>>>;
  entry?: Maybe<Entry>;
  entryKeys: Array<Scalars['String']>;
  highlight?: Maybe<Highlight>;
  highlights?: Maybe<Array<Maybe<Highlight>>>;
  journalEntries?: Maybe<Array<Maybe<JournalEntry>>>;
  journalEntry?: Maybe<JournalEntry>;
  journalEntryDates: Array<Scalars['String']>;
  journalEntryKeys: Array<Scalars['ID']>;
  journalId: Scalars['String'];
  journalMetadata: JournalMetadata;
  journalTitle: Scalars['String'];
  recentEntries: Array<Entry>;
  recentJournalEntries: Array<JournalEntry>;
  relation?: Maybe<Relation>;
  relations?: Maybe<Array<Maybe<Relation>>>;
  searchHighlights: Array<Highlight>;
  srsCard?: Maybe<SrsCard>;
  srsCardsForReview: Array<SrsCard>;
  srsReviewsFromDay: Array<SrsCardReview>;
};


export type QueryArcArgs = {
  id: Scalars['ID'];
};


export type QueryArcEntriesArgs = {
  entryKeys?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryArcEntryArgs = {
  arcId: Scalars['ID'];
};


export type QueryArcsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
  sort?: InputMaybe<ArcSortType>;
};


export type QueryEntriesArgs = {
  entryKeys?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryEntryArgs = {
  entryKey: Scalars['ID'];
};


export type QueryHighlightArgs = {
  id: Scalars['ID'];
};


export type QueryHighlightsArgs = {
  arcs?: InputMaybe<Array<Scalars['ID']>>;
  entries?: InputMaybe<Array<Scalars['ID']>>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryJournalEntriesArgs = {
  entryKeys?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryJournalEntryArgs = {
  entryKey: Scalars['ID'];
};


export type QueryRecentEntriesArgs = {
  count: Scalars['Int'];
};


export type QueryRecentJournalEntriesArgs = {
  count?: InputMaybe<Scalars['Int']>;
};


export type QueryRelationArgs = {
  id: Scalars['ID'];
};


export type QueryRelationsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QuerySearchHighlightsArgs = {
  criteria: SearchCriteria;
};


export type QuerySrsCardArgs = {
  id: Scalars['ID'];
};


export type QuerySrsCardsForReviewArgs = {
  day: Scalars['String'];
  deckId?: InputMaybe<Scalars['ID']>;
};


export type QuerySrsReviewsFromDayArgs = {
  day: Scalars['String'];
  deckId?: InputMaybe<Scalars['ID']>;
};

export type Relation = {
  __typename?: 'Relation';
  id: Scalars['ID'];
  object: Arc;
  predicate: Scalars['String'];
  subject: RelationSubject;
};

export type RelationSubject = Arc | Highlight;

export type SrsCard = {
  __typename?: 'SRSCard';
  deck: SrsDeck;
  ef: Scalars['Float'];
  endDate?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  interval: Scalars['Float'];
  lastReviewed: Scalars['String'];
  reviews: Array<SrsCardReview>;
  subject: SrsCardSubject;
  subjectType: SrsCardSubjectType;
};

export type SrsCardReview = {
  __typename?: 'SRSCardReview';
  afterEF: Scalars['Float'];
  afterInterval: Scalars['Float'];
  beforeEF: Scalars['Float'];
  beforeInterval: Scalars['Float'];
  card: SrsCard;
  day: Day;
  id: Scalars['ID'];
  rating: Scalars['Int'];
};

export type SrsCardSubject = Arc | Highlight;

export enum SrsCardSubjectType {
  Arc = 'Arc',
  Highlight = 'Highlight'
}

export type SrsDeck = {
  __typename?: 'SRSDeck';
  cards: Array<SrsCard>;
  id: Scalars['ID'];
};

export type SearchCriteria = {
  and: Array<SearchCriteriaAnd>;
};

export type SearchCriteriaAnd = {
  or: Array<SearchCriterion>;
};

export type SearchCriterion = {
  days?: InputMaybe<SearchCriterionDays>;
  relatesToArc?: InputMaybe<SearchCriterionRelatesToArc>;
  relatesToHighlight?: InputMaybe<SearchCriterionRelatesToHighlight>;
};

export type SearchCriterionDays = {
  days: Array<Scalars['String']>;
};

export type SearchCriterionRelatesToArc = {
  arcId: Scalars['String'];
  predicates?: InputMaybe<Array<Scalars['String']>>;
};

export type SearchCriterionRelatesToHighlight = {
  highlightId: Scalars['String'];
};

export type ArcChipConnectedQueryQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcChipConnectedQueryQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, name: string, color: number } | null };

export type ArcDetailContextQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcDetailContextQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, name: string, color: number, arcEntry: { __typename?: 'ArcEntry', entry: { __typename?: 'Entry', entryKey: string } } } | null };

export type ArcDetailPrefsBoxQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcDetailPrefsBoxQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, name: string, color: number } | null };

export type ArcSearchAutocompleteQueryVariables = Exact<{ [key: string]: never; }>;


export type ArcSearchAutocompleteQuery = { __typename?: 'Query', arcs?: Array<{ __typename?: 'Arc', id: string, name: string } | null> | null };

export type ArcTagQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcTagQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, color: number, name: string } | null };

export type BreadcrumbArcQueryQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type BreadcrumbArcQueryQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, color: number } | null };

export type BreadcrumbJournalEntryQueryQueryVariables = Exact<{
  journalEntryId: Scalars['ID'];
}>;


export type BreadcrumbJournalEntryQueryQuery = { __typename?: 'Query', journalEntry?: { __typename?: 'JournalEntry', entryKey: string, entry: { __typename?: 'Entry', date: string } } | null };

export type DailyJournalQueryVariables = Exact<{ [key: string]: never; }>;


export type DailyJournalQuery = { __typename?: 'Query', recentJournalEntries: Array<{ __typename?: 'JournalEntry', entryKey: string }> };

export type JournalEntryTodayQueryVariables = Exact<{
  entryKey: Scalars['ID'];
}>;


export type JournalEntryTodayQuery = { __typename?: 'Query', journalEntry?: { __typename?: 'JournalEntry', entryKey: string } | null };

export type PastDayReflectionsQueryVariables = Exact<{
  deckId?: InputMaybe<Scalars['ID']>;
  day: Scalars['String'];
}>;


export type PastDayReflectionsQuery = { __typename?: 'Query', srsReviewsFromDay: Array<{ __typename?: 'SRSCardReview', id: string, rating: number, card: { __typename?: 'SRSCard', id: string } }> };

export type TodayDayReflectionsQueryVariables = Exact<{
  deckId?: InputMaybe<Scalars['ID']>;
  day: Scalars['String'];
}>;


export type TodayDayReflectionsQuery = { __typename?: 'Query', srsCardsForReview: Array<{ __typename?: 'SRSCard', id: string, lastReviewed: string }>, srsReviewsFromDay: Array<{ __typename?: 'SRSCardReview', id: string, rating: number, beforeEF: number, beforeInterval: number, card: { __typename?: 'SRSCard', id: string } }> };

export type DigestQueryVariables = Exact<{
  entryKey: Scalars['ID'];
}>;


export type DigestQuery = { __typename?: 'Query', entry?: { __typename?: 'Entry', entryKey: string, date: string, highlights: Array<{ __typename?: 'Highlight', id: string, hue: number }> } | null };

export type DiptychContextHighlightQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type DiptychContextHighlightQuery = { __typename?: 'Query', highlight?: { __typename?: 'Highlight', id: string } | null };

export type HighlightAddReflectionFormQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type HighlightAddReflectionFormQuery = { __typename?: 'Query', highlights?: Array<{ __typename?: 'Highlight', id: string, srsCards: Array<{ __typename?: 'SRSCard', id: string }> } | null> | null };

export type HighlightBoxQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type HighlightBoxQuery = { __typename?: 'Query', highlight?: { __typename?: 'Highlight', id: string, entry: { __typename?: 'Entry', entryKey: string, date: string }, outgoingRelations: Array<{ __typename: 'Relation', predicate: string, object: { __typename?: 'Arc', id: string, color: number } }> } | null };

export type UseExcerptQueryQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type UseExcerptQueryQuery = { __typename?: 'Query', highlights?: Array<{ __typename?: 'Highlight', id: string, hue: number, entry: { __typename?: 'Entry', entryKey: string, htmlString: string } } | null> | null };

export type HighlightTagQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type HighlightTagQuery = { __typename?: 'Query', highlight?: { __typename?: 'Highlight', id: string, hue: number, outgoingRelations: Array<{ __typename?: 'Relation', id: string, object: { __typename: 'Arc', id: string, name: string, color: number } }> } | null };

export type HighlightsListQueryVariables = Exact<{
  highlightIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type HighlightsListQuery = { __typename?: 'Query', highlights?: Array<{ __typename?: 'Highlight', id: string, entry: { __typename?: 'Entry', entryKey: string, date: string } } | null> | null };

export type JournalDateRangeEntryKeysQueryVariables = Exact<{ [key: string]: never; }>;


export type JournalDateRangeEntryKeysQuery = { __typename?: 'Query', journalEntryKeys: Array<string> };

export type JournalTitleQueryVariables = Exact<{ [key: string]: never; }>;


export type JournalTitleQuery = { __typename?: 'Query', journalTitle: string };

export type LinkerQueryVariables = Exact<{ [key: string]: never; }>;


export type LinkerQuery = { __typename?: 'Query', journalMetadata: { __typename?: 'JournalMetadata', lastArcHue: number } };

export type ReflectionCardQueryVariables = Exact<{
  cardId: Scalars['ID'];
}>;


export type ReflectionCardQuery = { __typename?: 'Query', srsCard?: { __typename?: 'SRSCard', id: string, interval: number, ef: number, subject: { __typename: 'Arc', id: string, name: string } | { __typename: 'Highlight', id: string, entry: { __typename?: 'Entry', entryKey: string } } } | null };

export type ArcChooserQueryVariables = Exact<{ [key: string]: never; }>;


export type ArcChooserQuery = { __typename?: 'Query', arcs?: Array<{ __typename?: 'Arc', id: string, color: number, name: string } | null> | null };

export type HighlightAssignmentPluginQueryVariables = Exact<{
  entryKey: Scalars['ID'];
}>;


export type HighlightAssignmentPluginQuery = { __typename?: 'Query', entry?: { __typename?: 'Entry', highlights: Array<{ __typename?: 'Highlight', id: string, hue: number, entry: { __typename?: 'Entry', entryKey: string, date: string } }> } | null };

export type IpsumEditorQueryVariables = Exact<{
  entryKey: Scalars['ID'];
}>;


export type IpsumEditorQuery = { __typename?: 'Query', entry?: { __typename?: 'Entry', entryKey: string, htmlString: string, entryType: EntryType } | null };

export type UseSearchArcsQueryVariables = Exact<{ [key: string]: never; }>;


export type UseSearchArcsQuery = { __typename?: 'Query', arcs?: Array<{ __typename?: 'Arc', id: string, name: string, color: number } | null> | null };

export type UseHighlightSearchHighlightArcsQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type UseHighlightSearchHighlightArcsQuery = { __typename?: 'Query', highlight?: { __typename?: 'Highlight', outgoingRelations: Array<{ __typename?: 'Relation', id: string, object: { __typename?: 'Arc', id: string } }> } | null };

export type UseHighlightSearchQueryVariables = Exact<{
  searchCriteria: SearchCriteria;
}>;


export type UseHighlightSearchQuery = { __typename?: 'Query', searchHighlights: Array<{ __typename?: 'Highlight', id: string, entry: { __typename?: 'Entry', entryKey: string, date: string } }> };


export const ArcChipConnectedQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcChipConnectedQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<ArcChipConnectedQueryQuery, ArcChipConnectedQueryQueryVariables>;
export const ArcDetailContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcDetailContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"arcEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ArcDetailContextQuery, ArcDetailContextQueryVariables>;
export const ArcDetailPrefsBoxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcDetailPrefsBox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<ArcDetailPrefsBoxQuery, ArcDetailPrefsBoxQueryVariables>;
export const ArcSearchAutocompleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcSearchAutocomplete"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arcs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"EnumValue","value":"ALPHA_DESC"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ArcSearchAutocompleteQuery, ArcSearchAutocompleteQueryVariables>;
export const ArcTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ArcTagQuery, ArcTagQueryVariables>;
export const BreadcrumbArcQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BreadcrumbArcQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<BreadcrumbArcQueryQuery, BreadcrumbArcQueryQueryVariables>;
export const BreadcrumbJournalEntryQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BreadcrumbJournalEntryQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"journalEntryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"journalEntryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]} as unknown as DocumentNode<BreadcrumbJournalEntryQueryQuery, BreadcrumbJournalEntryQueryQueryVariables>;
export const DailyJournalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DailyJournal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recentJournalEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}}]}}]}}]} as unknown as DocumentNode<DailyJournalQuery, DailyJournalQueryVariables>;
export const JournalEntryTodayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalEntryToday"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}}]}}]}}]} as unknown as DocumentNode<JournalEntryTodayQuery, JournalEntryTodayQueryVariables>;
export const PastDayReflectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PastDayReflections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"day"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"srsReviewsFromDay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"day"},"value":{"kind":"Variable","name":{"kind":"Name","value":"day"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PastDayReflectionsQuery, PastDayReflectionsQueryVariables>;
export const TodayDayReflectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TodayDayReflections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"day"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"srsCardsForReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"day"},"value":{"kind":"Variable","name":{"kind":"Name","value":"day"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastReviewed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"srsReviewsFromDay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"day"},"value":{"kind":"Variable","name":{"kind":"Name","value":"day"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"beforeEF"}},{"kind":"Field","name":{"kind":"Name","value":"beforeInterval"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TodayDayReflectionsQuery, TodayDayReflectionsQueryVariables>;
export const DigestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Digest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}}]}}]}}]}}]} as unknown as DocumentNode<DigestQuery, DigestQueryVariables>;
export const DiptychContextHighlightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiptychContextHighlight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DiptychContextHighlightQuery, DiptychContextHighlightQueryVariables>;
export const HighlightAddReflectionFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightAddReflectionForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"srsCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<HighlightAddReflectionFormQuery, HighlightAddReflectionFormQueryVariables>;
export const HighlightBoxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightBox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<HighlightBoxQuery, HighlightBoxQueryVariables>;
export const UseExcerptQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseExcerptQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"htmlString"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hue"}}]}}]}}]} as unknown as DocumentNode<UseExcerptQueryQuery, UseExcerptQueryQueryVariables>;
export const HighlightTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<HighlightTagQuery, HighlightTagQueryVariables>;
export const HighlightsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]} as unknown as DocumentNode<HighlightsListQuery, HighlightsListQueryVariables>;
export const JournalDateRangeEntryKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalDateRangeEntryKeys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalEntryKeys"}}]}}]} as unknown as DocumentNode<JournalDateRangeEntryKeysQuery, JournalDateRangeEntryKeysQueryVariables>;
export const JournalTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalTitle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalTitle"}}]}}]} as unknown as DocumentNode<JournalTitleQuery, JournalTitleQueryVariables>;
export const LinkerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Linker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastArcHue"}}]}}]}}]} as unknown as DocumentNode<LinkerQuery, LinkerQueryVariables>;
export const ReflectionCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReflectionCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"srsCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"ef"}},{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Highlight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReflectionCardQuery, ReflectionCardQueryVariables>;
export const ArcChooserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcChooser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ArcChooserQuery, ArcChooserQueryVariables>;
export const HighlightAssignmentPluginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightAssignmentPlugin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hue"}}]}}]}}]}}]} as unknown as DocumentNode<HighlightAssignmentPluginQuery, HighlightAssignmentPluginQueryVariables>;
export const IpsumEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IpsumEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"htmlString"}},{"kind":"Field","name":{"kind":"Name","value":"entryType"}}]}}]}}]} as unknown as DocumentNode<IpsumEditorQuery, IpsumEditorQueryVariables>;
export const UseSearchArcsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseSearchArcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<UseSearchArcsQuery, UseSearchArcsQueryVariables>;
export const UseHighlightSearchHighlightArcsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseHighlightSearchHighlightArcs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UseHighlightSearchHighlightArcsQuery, UseHighlightSearchHighlightArcsQueryVariables>;
export const UseHighlightSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseHighlightSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchCriteria"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchCriteria"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchHighlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"criteria"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchCriteria"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]} as unknown as DocumentNode<UseHighlightSearchQuery, UseHighlightSearchQueryVariables>;