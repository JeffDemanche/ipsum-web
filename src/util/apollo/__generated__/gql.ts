/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query ArcAssignmentPopper {\n    journalMetadata {\n      lastArcHue\n    }\n  }\n": types.ArcAssignmentPopperDocument,
    "\n  query HighlightDecoration($highlightIds: [ID!]!, $arcIds: [ID!]!) {\n    highlights(ids: $highlightIds) {\n      id\n      arc {\n        id\n        color\n      }\n    }\n    arcs(ids: $arcIds) {\n      id\n      name\n      color\n    }\n  }\n": types.HighlightDecorationDocument,
    "\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      highlights {\n        id\n      }\n    }\n  }\n": types.DigestDocument,
    "\n  query HighlightExcerpt($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        contentState\n      }\n    }\n  }\n": types.HighlightExcerptDocument,
    "\n  query JournalTitle {\n    journalTitle\n  }\n": types.JournalTitleDocument,
    "\n  query MedianHighlightBox($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      arc {\n        id\n        color\n      }\n      entry {\n        entryKey\n      }\n    }\n  }\n": types.MedianHighlightBoxDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcAssignmentPopper {\n    journalMetadata {\n      lastArcHue\n    }\n  }\n"): (typeof documents)["\n  query ArcAssignmentPopper {\n    journalMetadata {\n      lastArcHue\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightDecoration($highlightIds: [ID!]!, $arcIds: [ID!]!) {\n    highlights(ids: $highlightIds) {\n      id\n      arc {\n        id\n        color\n      }\n    }\n    arcs(ids: $arcIds) {\n      id\n      name\n      color\n    }\n  }\n"): (typeof documents)["\n  query HighlightDecoration($highlightIds: [ID!]!, $arcIds: [ID!]!) {\n    highlights(ids: $highlightIds) {\n      id\n      arc {\n        id\n        color\n      }\n    }\n    arcs(ids: $arcIds) {\n      id\n      name\n      color\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      highlights {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      highlights {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightExcerpt($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        contentState\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightExcerpt($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        contentState\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query JournalTitle {\n    journalTitle\n  }\n"): (typeof documents)["\n  query JournalTitle {\n    journalTitle\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query MedianHighlightBox($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      arc {\n        id\n        color\n      }\n      entry {\n        entryKey\n      }\n    }\n  }\n"): (typeof documents)["\n  query MedianHighlightBox($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      arc {\n        id\n        color\n      }\n      entry {\n        entryKey\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;