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
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Entry = {
  __typename?: 'Entry';
  contentState: Scalars['String'];
  date: Scalars['String'];
  entryKey: Scalars['String'];
};

export type Highlight = {
  __typename?: 'Highlight';
  arc: Arc;
  entry: Entry;
  id: Scalars['ID'];
};

export type JournalMetadata = {
  __typename?: 'JournalMetadata';
  lastArcHue: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  arcs?: Maybe<Array<Maybe<Arc>>>;
  entries?: Maybe<Array<Maybe<Entry>>>;
  highlights?: Maybe<Array<Maybe<Highlight>>>;
  journalId: Scalars['String'];
  journalMetadata: JournalMetadata;
  journalTitle: Scalars['String'];
};


export type QueryArcsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryEntriesArgs = {
  entryKeys?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryHighlightsArgs = {
  arcs?: InputMaybe<Array<Scalars['ID']>>;
  entries?: InputMaybe<Array<Scalars['ID']>>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export type ArcAssignmentPopperQueryVariables = Exact<{ [key: string]: never; }>;


export type ArcAssignmentPopperQuery = { __typename?: 'Query', journalMetadata: { __typename?: 'JournalMetadata', lastArcHue: number } };

export type JournalTitleQueryVariables = Exact<{ [key: string]: never; }>;


export type JournalTitleQuery = { __typename?: 'Query', journalTitle: string };

export type MedianHighlightBoxQueryVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type MedianHighlightBoxQuery = { __typename?: 'Query', highlights?: Array<{ __typename?: 'Highlight', id: string, arc: { __typename?: 'Arc', id: string, color: number }, entry: { __typename?: 'Entry', entryKey: string } } | null> | null };


export const ArcAssignmentPopperDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArcAssignmentPopper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastArcHue"}}]}}]}}]} as unknown as DocumentNode<ArcAssignmentPopperQuery, ArcAssignmentPopperQueryVariables>;
export const JournalTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalTitle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalTitle"}}]}}]} as unknown as DocumentNode<JournalTitleQuery, JournalTitleQueryVariables>;
export const MedianHighlightBoxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MedianHighlightBox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"highlights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"arc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}}]}}]}}]}}]} as unknown as DocumentNode<MedianHighlightBoxQuery, MedianHighlightBoxQueryVariables>;