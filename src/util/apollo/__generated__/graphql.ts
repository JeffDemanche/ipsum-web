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
  highlight: Highlight;
  history: History;
  id: Scalars['ID'];
  parent?: Maybe<Comment>;
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
  hasJournalEntry: Scalars['Boolean'];
  journalEntry?: Maybe<JournalEntry>;
  ratedHighlights?: Maybe<Array<Highlight>>;
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
  comments: Array<Comment>;
  currentImportance: Scalars['Float'];
  entry: Entry;
  excerpt: Scalars['String'];
  history: History;
  hue: Scalars['Int'];
  id: Scalars['ID'];
  importanceRatings: Array<ImportanceRating>;
  number: Scalars['Int'];
  object: HighlightObject;
  objectText: Scalars['String'];
  outgoingRelations: Array<Relation>;
};

export type HighlightObject = Arc | Comment | Day;

export enum HighlightSortType {
  DateDesc = 'DATE_DESC',
  ImportanceDesc = 'IMPORTANCE_DESC'
}

export type History = {
  __typename?: 'History';
  dateCreated?: Maybe<Scalars['String']>;
};

export type ImportanceRating = {
  __typename?: 'ImportanceRating';
  day: Day;
  value: Scalars['Float'];
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
  comment?: Maybe<Comment>;
  commentEntries?: Maybe<Array<Maybe<CommentEntry>>>;
  commentEntry?: Maybe<CommentEntry>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  commentsForDay?: Maybe<Array<Maybe<Comment>>>;
  day?: Maybe<Day>;
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
  searchArcsByName: Array<Arc>;
  searchHighlights: Array<Highlight>;
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


export type QueryCommentArgs = {
  id: Scalars['ID'];
};


export type QueryCommentEntriesArgs = {
  entryKeys?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryCommentEntryArgs = {
  entryKey: Scalars['ID'];
};


export type QueryCommentsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryCommentsForDayArgs = {
  day: Scalars['String'];
};


export type QueryDayArgs = {
  day: Scalars['String'];
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
  sort?: InputMaybe<HighlightSortType>;
};


export type QueryJournalEntriesArgs = {
  entryKeys?: InputMaybe<Array<Scalars['ID']>>;
  includeEmpty?: InputMaybe<Scalars['Boolean']>;
};


export type QueryJournalEntryArgs = {
  entryKey: Scalars['ID'];
};


export type QueryJournalEntryDatesArgs = {
  includeEmpty?: InputMaybe<Scalars['Boolean']>;
};


export type QueryJournalEntryKeysArgs = {
  includeEmpty?: InputMaybe<Scalars['Boolean']>;
};


export type QueryRecentEntriesArgs = {
  count: Scalars['Int'];
};


export type QueryRecentJournalEntriesArgs = {
  count?: InputMaybe<Scalars['Int']>;
  includeEmpty?: InputMaybe<Scalars['Boolean']>;
};


export type QueryRelationArgs = {
  id: Scalars['ID'];
};


export type QueryRelationsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QuerySearchArcsByNameArgs = {
  search: Scalars['String'];
};


export type QuerySearchHighlightsArgs = {
  criteria: SearchCriteria;
};

export type Relation = {
  __typename?: 'Relation';
  id: Scalars['ID'];
  object: Arc;
  predicate: Scalars['String'];
  subject: RelationSubject;
};

export type RelationSubject = Arc | Highlight;

export type SearchCriteria = {
  and: Array<SearchCriteriaAnd>;
  sort?: InputMaybe<SearchSort>;
};

export type SearchCriteriaAnd = {
  or: Array<SearchCriterion>;
};

export type SearchCriterion = {
  days?: InputMaybe<SearchCriterionDays>;
  relatesToArc?: InputMaybe<SearchCriterionRelatesToArc>;
};

export type SearchCriterionDays = {
  days: Array<Scalars['String']>;
};

export type SearchCriterionRelatesToArc = {
  arcId: Scalars['String'];
  predicate: Scalars['String'];
};

export type SearchSort = {
  sortDay: Scalars['String'];
  type: SearchSortType;
};

export enum SearchSortType {
  Date = 'DATE',
  Importance = 'IMPORTANCE'
}

export type UseArcRelationsTableConnectedQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type UseArcRelationsTableConnectedQuery = { __typename?: 'Query', searchArcsByName: Array<{ __typename?: 'Arc', id: string, name: string, color: number }> };

export type UseHighlightRelationsTableConnectedQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type UseHighlightRelationsTableConnectedQuery = { __typename?: 'Query', searchArcsByName: Array<{ __typename?: 'Arc', id: string, name: string, color: number }> };

export type ArcPageQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcPageQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, name: string, color: number, outgoingRelations: Array<{ __typename?: 'Relation', id: string, predicate: string, object: { __typename?: 'Arc', id: string, name: string, color: number } }>, arcEntry: { __typename?: 'ArcEntry', entry: { __typename?: 'Entry', entryKey: string, htmlString: string, highlights: Array<{ __typename?: 'Highlight', id: string, number: number, hue: number, outgoingRelations: Array<{ __typename?: 'Relation', id: string, predicate: string, object: { __typename?: 'Arc', id: string, name: string, color: number } }> }> } } } | null };

export type BrowserDrawerQueryVariables = Exact<{
  filterArcIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type BrowserDrawerQuery = { __typename?: 'Query', journalEntryDates: Array<string>, arcs?: Array<{ __typename?: 'Arc', id: string, name: string, color: number } | null> | null };

export type BrowserDrawerHighlightsSearchQueryVariables = Exact<{
  criteria: SearchCriteria;
}>;


export type BrowserDrawerHighlightsSearchQuery = { __typename?: 'Query', searchHighlights: Array<{ __typename?: 'Highlight', id: string, excerpt: string, hue: number, number: number, objectText: string, outgoingRelations: Array<{ __typename?: 'Relation', id: string, predicate: string, object: { __typename?: 'Arc', id: string, name: string, color: number } }>, importanceRatings: Array<{ __typename?: 'ImportanceRating', value: number, day: { __typename?: 'Day', day: string } }>, history: { __typename?: 'History', dateCreated?: string | null }, object: { __typename: 'Arc', id: string } | { __typename: 'Comment', id: string, highlight: { __typename?: 'Highlight', id: string } } | { __typename: 'Day', day: string } }> };

export type DailyJournalEntryQueryQueryVariables = Exact<{
  entryKey: Scalars['ID'];
  day: Scalars['String'];
}>;


export type DailyJournalEntryQueryQuery = { __typename?: 'Query', journalEntryDates: Array<string>, journalEntry?: { __typename?: 'JournalEntry', entryKey: string, entry: { __typename?: 'Entry', htmlString: string, highlights: Array<{ __typename?: 'Highlight', id: string, hue: number, number: number, arcs: Array<{ __typename?: 'Arc', id: string, name: string }> }> } } | null, day?: { __typename?: 'Day', comments?: Array<{ __typename?: 'Comment', id: string, commentEntry: { __typename?: 'CommentEntry', entry: { __typename?: 'Entry', entryKey: string, htmlString: string, highlights: Array<{ __typename?: 'Highlight', id: string, hue: number, number: number, arcs: Array<{ __typename?: 'Arc', id: string, name: string }> }> } }, highlight: { __typename?: 'Highlight', id: string, hue: number, arcs: Array<{ __typename?: 'Arc', id: string, name: string }> } }> | null } | null };

export type HighlightPageQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type HighlightPageQuery = { __typename?: 'Query', highlight?: { __typename?: 'Highlight', id: string, hue: number, number: number, objectText: string, arcs: Array<{ __typename?: 'Arc', id: string, name: string }>, entry: { __typename?: 'Entry', entryKey: string, htmlString: string }, outgoingRelations: Array<{ __typename?: 'Relation', id: string, predicate: string, object: { __typename?: 'Arc', id: string, name: string, color: number } }>, comments: Array<{ __typename?: 'Comment', id: string, history: { __typename?: 'History', dateCreated?: string | null }, highlight: { __typename?: 'Highlight', id: string, number: number, hue: number, objectText: string, outgoingRelations: Array<{ __typename?: 'Relation', id: string, predicate: string, object: { __typename?: 'Arc', id: string, name: string, color: number } }> }, commentEntry: { __typename?: 'CommentEntry', entry: { __typename?: 'Entry', entryKey: string, htmlString: string, highlights: Array<{ __typename?: 'Highlight', id: string, number: number, hue: number, outgoingRelations: Array<{ __typename?: 'Relation', id: string, predicate: string, object: { __typename?: 'Arc', id: string, name: string } }> }> } } }> } | null };

export type JournalSettingsDrawerQueryVariables = Exact<{ [key: string]: never; }>;


export type JournalSettingsDrawerQuery = { __typename?: 'Query', journalTitle: string };


export const UseArcRelationsTableConnectedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseArcRelationsTableConnected"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchArcsByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<UseArcRelationsTableConnectedQuery, UseArcRelationsTableConnectedQueryVariables>;
export const UseHighlightRelationsTableConnectedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseHighlightRelationsTableConnected"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchArcsByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<UseHighlightRelationsTableConnectedQuery, UseHighlightRelationsTableConnectedQueryVariables>;
export const ArcPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"arcEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"htmlString"}},{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ArcPageQuery, ArcPageQueryVariables>;
export const BrowserDrawerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BrowserDrawer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArcIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalEntryDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeEmpty"},"value":{"kind":"BooleanValue","value":false}}]},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArcIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<BrowserDrawerQuery, BrowserDrawerQueryVariables>;
export const BrowserDrawerHighlightsSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BrowserDrawerHighlightsSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"criteria"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchCriteria"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchHighlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"criteria"},"value":{"kind":"Variable","name":{"kind":"Name","value":"criteria"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"importanceRatings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"objectText"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateCreated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Day"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"highlight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<BrowserDrawerHighlightsSearchQuery, BrowserDrawerHighlightsSearchQueryVariables>;
export const DailyJournalEntryQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DailyJournalEntryQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"day"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalEntryDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeEmpty"},"value":{"kind":"BooleanValue","value":false}}]},{"kind":"Field","name":{"kind":"Name","value":"journalEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"htmlString"}},{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"day"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"day"},"value":{"kind":"Variable","name":{"kind":"Name","value":"day"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"commentEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"htmlString"}},{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"highlight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<DailyJournalEntryQueryQuery, DailyJournalEntryQueryQueryVariables>;
export const HighlightPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"objectText"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"htmlString"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateCreated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"highlight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"objectText"}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"commentEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"hue"}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"htmlString"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<HighlightPageQuery, HighlightPageQueryVariables>;
export const JournalSettingsDrawerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalSettingsDrawer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalTitle"}}]}}]} as unknown as DocumentNode<JournalSettingsDrawerQuery, JournalSettingsDrawerQueryVariables>;