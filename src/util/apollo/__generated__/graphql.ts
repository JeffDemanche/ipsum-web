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
  color: Scalars['Int'];
  highlights: Array<Highlight>;
  id: Scalars['ID'];
  incomingRelations: Array<Relation>;
  name: Scalars['String'];
  outgoingRelations: Array<Relation>;
};

export type Entry = {
  __typename?: 'Entry';
  contentState: Scalars['String'];
  date: Scalars['String'];
  entryKey: Scalars['String'];
  highlights: Array<Highlight>;
};

export type Highlight = {
  __typename?: 'Highlight';
  arc?: Maybe<Arc>;
  arcs: Array<Arc>;
  entry: Entry;
  id: Scalars['ID'];
  outgoingRelations: Array<Relation>;
};

export type JournalMetadata = {
  __typename?: 'JournalMetadata';
  lastArcHue: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  arc?: Maybe<Arc>;
  arcs?: Maybe<Array<Maybe<Arc>>>;
  entries?: Maybe<Array<Maybe<Entry>>>;
  entry?: Maybe<Entry>;
  entryDates: Array<Scalars['String']>;
  highlight?: Maybe<Highlight>;
  highlights?: Maybe<Array<Maybe<Highlight>>>;
  journalId: Scalars['String'];
  journalMetadata: JournalMetadata;
  journalTitle: Scalars['String'];
  recentEntries: Array<Entry>;
  relation?: Maybe<Relation>;
  relations?: Maybe<Array<Maybe<Relation>>>;
};


export type QueryArcArgs = {
  id: Scalars['ID'];
};


export type QueryArcsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
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


export type QueryRecentEntriesArgs = {
  count: Scalars['Int'];
};


export type QueryRelationArgs = {
  id: Scalars['ID'];
};


export type QueryRelationsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export type Relation = {
  __typename?: 'Relation';
  id: Scalars['ID'];
  object: Arc;
  predicate: Scalars['String'];
  subject: RelationSubject;
};

export type RelationSubject = Arc | Highlight;

export type ArcAssignmentPopperQueryVariables = Exact<{ [key: string]: never; }>;


export type ArcAssignmentPopperQuery = { __typename?: 'Query', journalMetadata: { __typename?: 'JournalMetadata', lastArcHue: number } };

export type ArcDetailQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcDetailQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, color: number } | null };

export type ArcDetailContextQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcDetailContextQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, name: string, color: number } | null };

export type ArcDetailPrefsBoxQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcDetailPrefsBoxQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, color: number } | null };

export type ArcTagQueryVariables = Exact<{
  arcId: Scalars['ID'];
}>;


export type ArcTagQuery = { __typename?: 'Query', arc?: { __typename?: 'Arc', id: string, color: number, name: string } | null };

export type CalendarQueryVariables = Exact<{ [key: string]: never; }>;


export type CalendarQuery = { __typename?: 'Query', entries?: Array<{ __typename?: 'Entry', entryKey: string, date: string } | null> | null };

export type UseJournalEntryEditorQueryVariables = Exact<{
  entryKey: Scalars['ID'];
}>;


export type UseJournalEntryEditorQuery = { __typename?: 'Query', entry?: { __typename?: 'Entry', entryKey: string, contentState: string } | null };

export type HighlightDecorationQueryVariables = Exact<{
  highlightIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type HighlightDecorationQuery = { __typename?: 'Query', highlights?: Array<{ __typename?: 'Highlight', id: string, arc?: { __typename?: 'Arc', id: string, name: string, color: number } | null } | null> | null };

export type DigestQueryVariables = Exact<{
  entryKey: Scalars['ID'];
}>;


export type DigestQuery = { __typename?: 'Query', entry?: { __typename?: 'Entry', entryKey: string, highlights: Array<{ __typename?: 'Highlight', id: string }> } | null };

export type HighlightExcerptQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type HighlightExcerptQuery = { __typename?: 'Query', highlights?: Array<{ __typename?: 'Highlight', id: string, entry: { __typename?: 'Entry', entryKey: string, contentState: string } } | null> | null };

export type HighlightSelectionProviderQueryVariables = Exact<{
  highlightIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type HighlightSelectionProviderQuery = { __typename?: 'Query', highlights?: Array<{ __typename?: 'Highlight', id: string } | null> | null };

export type HighlightTagQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type HighlightTagQuery = { __typename?: 'Query', highlight?: { __typename?: 'Highlight', id: string, arc?: { __typename?: 'Arc', id: string, name: string, color: number } | null } | null };

export type JournalDateRangeRecentEntriesQueryVariables = Exact<{
  count: Scalars['Int'];
}>;


export type JournalDateRangeRecentEntriesQuery = { __typename?: 'Query', recentEntries: Array<{ __typename?: 'Entry', entryKey: string, date: string }> };

export type JournalDateRangeQueryVariables = Exact<{
  entryKeys: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type JournalDateRangeQuery = { __typename?: 'Query', entryDates: Array<string> };

export type JournalTitleQueryVariables = Exact<{ [key: string]: never; }>;


export type JournalTitleQuery = { __typename?: 'Query', journalTitle: string };

export type LinkerQueryVariables = Exact<{ [key: string]: never; }>;


export type LinkerQuery = { __typename?: 'Query', journalMetadata: { __typename?: 'JournalMetadata', lastArcHue: number } };

export type MedianHighlightBoxQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type MedianHighlightBoxQuery = { __typename?: 'Query', highlights?: Array<{ __typename?: 'Highlight', id: string, entry: { __typename?: 'Entry', entryKey: string, date: string }, outgoingRelations: Array<{ __typename: 'Relation', predicate: string, object: { __typename?: 'Arc', id: string, color: number } }> } | null> | null };

export type VisibleEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type VisibleEntriesQuery = { __typename?: 'Query', entries?: Array<{ __typename?: 'Entry', entryKey: string, date: string } | null> | null };

export type UseHighlightSearchQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type UseHighlightSearchQuery = { __typename?: 'Query', highlight?: { __typename?: 'Highlight', id: string, outgoingRelations: Array<{ __typename?: 'Relation', id: string, predicate: string, object: { __typename?: 'Arc', id: string, incomingRelations: Array<{ __typename?: 'Relation', id: string, predicate: string, subject: { __typename: 'Arc' } | { __typename: 'Highlight', id: string, entry: { __typename?: 'Entry', entryKey: string, date: string } } }> } }> } | null };

export type UseSearchArcsQueryVariables = Exact<{ [key: string]: never; }>;


export type UseSearchArcsQuery = { __typename?: 'Query', arcs?: Array<{ __typename?: 'Arc', id: string, name: string, color: number } | null> | null };


export const ArcAssignmentPopperDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcAssignmentPopper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastArcHue"}}]}}]}}]} as unknown as DocumentNode<ArcAssignmentPopperQuery, ArcAssignmentPopperQueryVariables>;
export const ArcDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<ArcDetailQuery, ArcDetailQueryVariables>;
export const ArcDetailContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcDetailContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<ArcDetailContextQuery, ArcDetailContextQueryVariables>;
export const ArcDetailPrefsBoxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcDetailPrefsBox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<ArcDetailPrefsBoxQuery, ArcDetailPrefsBoxQueryVariables>;
export const ArcTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arcId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ArcTagQuery, ArcTagQueryVariables>;
export const CalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Calendar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<CalendarQuery, CalendarQueryVariables>;
export const UseJournalEntryEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseJournalEntryEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"contentState"}}]}}]}}]} as unknown as DocumentNode<UseJournalEntryEditorQuery, UseJournalEntryEditorQueryVariables>;
export const HighlightDecorationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightDecoration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"arc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode<HighlightDecorationQuery, HighlightDecorationQueryVariables>;
export const DigestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Digest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DigestQuery, DigestQueryVariables>;
export const HighlightExcerptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightExcerpt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"contentState"}}]}}]}}]}}]} as unknown as DocumentNode<HighlightExcerptQuery, HighlightExcerptQueryVariables>;
export const HighlightSelectionProviderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightSelectionProvider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<HighlightSelectionProviderQuery, HighlightSelectionProviderQueryVariables>;
export const HighlightTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HighlightTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"arc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode<HighlightTagQuery, HighlightTagQueryVariables>;
export const JournalDateRangeRecentEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalDateRangeRecentEntries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recentEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<JournalDateRangeRecentEntriesQuery, JournalDateRangeRecentEntriesQueryVariables>;
export const JournalDateRangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalDateRange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKeys"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryDates"}}]}}]} as unknown as DocumentNode<JournalDateRangeQuery, JournalDateRangeQueryVariables>;
export const JournalTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalTitle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalTitle"}}]}}]} as unknown as DocumentNode<JournalTitleQuery, JournalTitleQueryVariables>;
export const LinkerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Linker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastArcHue"}}]}}]}}]} as unknown as DocumentNode<LinkerQuery, LinkerQueryVariables>;
export const MedianHighlightBoxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MedianHighlightBox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Arc"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MedianHighlightBoxQuery, MedianHighlightBoxQueryVariables>;
export const VisibleEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisibleEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<VisibleEntriesQuery, VisibleEntriesQueryVariables>;
export const UseHighlightSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseHighlightSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"outgoingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"incomingRelations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"predicate"}},{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Highlight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UseHighlightSearchQuery, UseHighlightSearchQueryVariables>;
export const UseSearchArcsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseSearchArcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<UseSearchArcsQuery, UseSearchArcsQueryVariables>;