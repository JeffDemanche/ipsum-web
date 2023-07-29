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
    "\n  query ArcDetail($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n    }\n  }\n": types.ArcDetailDocument,
    "\n  query ArcDetailContext($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      arcEntry {\n        entry {\n          entryKey\n        }\n      }\n    }\n  }\n": types.ArcDetailContextDocument,
    "\n  query ArcDetailPrefsBox($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n    }\n  } \n": types.ArcDetailPrefsBoxDocument,
    "\n  query ArcTag($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n      name\n    }\n  }\n": types.ArcTagDocument,
    "\n  query DailyJournalEditor($before: String!, $after: String!) {\n    journalEntryDates(before: $before, after: $after) \n  }\n": types.DailyJournalEditorDocument,
    "\n  query HighlightDecoration($highlightIds: [ID!]!) {\n    highlights(ids: $highlightIds) {\n      id\n      arc {\n        id\n        name\n        color\n      }\n    }\n  }\n": types.HighlightDecorationDocument,
    "\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      highlights {\n        id\n      }\n    }\n  }\n": types.DigestDocument,
    "\n  query UseJournalEntryEditor($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      contentState\n    }\n  }\n": types.UseJournalEntryEditorDocument,
    "\n  query HighlightExcerpt($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        contentState\n      }\n    }\n  }\n": types.HighlightExcerptDocument,
    "\n  query HighlightSelectionProvider($highlightIds: [ID!]) {\n    highlights(ids: $highlightIds) {\n      id\n    }\n  }\n": types.HighlightSelectionProviderDocument,
    "\n  query HighlightTag($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      outgoingRelations {\n        id\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n": types.HighlightTagDocument,
    "\n  query JournalDateRangeRecentEntries($count: Int!) {\n    recentEntries(count: $count) {\n      entryKey\n      date\n    }\n  }\n": types.JournalDateRangeRecentEntriesDocument,
    "\n  query JournalDateRange($entryKeys: [ID!]!) {\n    entryDates\n  }\n": types.JournalDateRangeDocument,
    "\n  query JournalTitle {\n    journalTitle\n  }\n": types.JournalTitleDocument,
    "\n  query Linker {\n    journalMetadata {\n      lastArcHue\n    }\n  }\n": types.LinkerDocument,
    "\n  query MedianHighlightBox($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        date\n      }\n      outgoingRelations {\n        __typename\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n": types.MedianHighlightBoxDocument,
    "\n  query VisibleEntries {\n    journalEntries {\n      entryKey\n      entry {\n        entryKey\n        date\n      }\n    }\n  }\n": types.VisibleEntriesDocument,
    "\n  query UseHighlightSearch($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      outgoingRelations {\n        id\n        predicate\n        object {\n          id\n          incomingRelations {\n            id\n            predicate\n            subject {\n              __typename\n              ... on Highlight {\n                id\n                entry {\n                  entryKey\n                  date\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.UseHighlightSearchDocument,
    "\n  query UseSearchArcs {\n    arcs {\n      id\n      name\n      color\n    }\n  }\n": types.UseSearchArcsDocument,
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
export function gql(source: "\n  query ArcDetail($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n    }\n  }\n"): (typeof documents)["\n  query ArcDetail($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcDetailContext($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      arcEntry {\n        entry {\n          entryKey\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ArcDetailContext($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      arcEntry {\n        entry {\n          entryKey\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcDetailPrefsBox($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n    }\n  } \n"): (typeof documents)["\n  query ArcDetailPrefsBox($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n    }\n  } \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcTag($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n      name\n    }\n  }\n"): (typeof documents)["\n  query ArcTag($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      color\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query DailyJournalEditor($before: String!, $after: String!) {\n    journalEntryDates(before: $before, after: $after) \n  }\n"): (typeof documents)["\n  query DailyJournalEditor($before: String!, $after: String!) {\n    journalEntryDates(before: $before, after: $after) \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightDecoration($highlightIds: [ID!]!) {\n    highlights(ids: $highlightIds) {\n      id\n      arc {\n        id\n        name\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightDecoration($highlightIds: [ID!]!) {\n    highlights(ids: $highlightIds) {\n      id\n      arc {\n        id\n        name\n        color\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      highlights {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      highlights {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseJournalEntryEditor($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      contentState\n    }\n  }\n"): (typeof documents)["\n  query UseJournalEntryEditor($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      contentState\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightExcerpt($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        contentState\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightExcerpt($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        contentState\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightSelectionProvider($highlightIds: [ID!]) {\n    highlights(ids: $highlightIds) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query HighlightSelectionProvider($highlightIds: [ID!]) {\n    highlights(ids: $highlightIds) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightTag($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      outgoingRelations {\n        id\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightTag($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      outgoingRelations {\n        id\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query JournalDateRangeRecentEntries($count: Int!) {\n    recentEntries(count: $count) {\n      entryKey\n      date\n    }\n  }\n"): (typeof documents)["\n  query JournalDateRangeRecentEntries($count: Int!) {\n    recentEntries(count: $count) {\n      entryKey\n      date\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query JournalDateRange($entryKeys: [ID!]!) {\n    entryDates\n  }\n"): (typeof documents)["\n  query JournalDateRange($entryKeys: [ID!]!) {\n    entryDates\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query JournalTitle {\n    journalTitle\n  }\n"): (typeof documents)["\n  query JournalTitle {\n    journalTitle\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Linker {\n    journalMetadata {\n      lastArcHue\n    }\n  }\n"): (typeof documents)["\n  query Linker {\n    journalMetadata {\n      lastArcHue\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query MedianHighlightBox($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        date\n      }\n      outgoingRelations {\n        __typename\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MedianHighlightBox($highlightId: ID!) {\n    highlights(ids: [$highlightId]) {\n      id\n      entry {\n        entryKey\n        date\n      }\n      outgoingRelations {\n        __typename\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query VisibleEntries {\n    journalEntries {\n      entryKey\n      entry {\n        entryKey\n        date\n      }\n    }\n  }\n"): (typeof documents)["\n  query VisibleEntries {\n    journalEntries {\n      entryKey\n      entry {\n        entryKey\n        date\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseHighlightSearch($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      outgoingRelations {\n        id\n        predicate\n        object {\n          id\n          incomingRelations {\n            id\n            predicate\n            subject {\n              __typename\n              ... on Highlight {\n                id\n                entry {\n                  entryKey\n                  date\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query UseHighlightSearch($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      outgoingRelations {\n        id\n        predicate\n        object {\n          id\n          incomingRelations {\n            id\n            predicate\n            subject {\n              __typename\n              ... on Highlight {\n                id\n                entry {\n                  entryKey\n                  date\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseSearchArcs {\n    arcs {\n      id\n      name\n      color\n    }\n  }\n"): (typeof documents)["\n  query UseSearchArcs {\n    arcs {\n      id\n      name\n      color\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;