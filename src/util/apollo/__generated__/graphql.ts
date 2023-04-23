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

export type JournalTitleQueryVariables = Exact<{ [key: string]: never; }>;


export type JournalTitleQuery = { __typename?: 'Query', journalTitle: string };

export type TestQueryQueryVariables = Exact<{
  entryKey: Scalars['String'];
}>;


export type TestQueryQuery = { __typename?: 'Query', entries?: Array<{ __typename?: 'Entry', entryKey: string } | null> | null };


export const JournalTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalTitle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalTitle"}}]}}]} as unknown as DocumentNode<JournalTitleQuery, JournalTitleQueryVariables>;
export const TestQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryKey"}}]}}]}}]} as unknown as DocumentNode<TestQueryQuery, TestQueryQueryVariables>;