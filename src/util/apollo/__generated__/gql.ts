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
    "\n  query ArcChipConnectedQuery($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n    }\n  }\n": types.ArcChipConnectedQueryDocument,
    "\n  query ArcDetailContext($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      arcEntry {\n        entry {\n          entryKey\n        }\n      }\n    }\n  }\n": types.ArcDetailContextDocument,
    "\n  query ArcDetailPrefsBox($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n    }\n  } \n": types.ArcDetailPrefsBoxDocument,
    "\n  query ArcSearchAutocomplete {\n    arcs(sort: ALPHA_DESC) {\n      id\n      name\n    }\n  }\n": types.ArcSearchAutocompleteDocument,
    "\n  query BreadcrumbJournalEntryQuery($journalEntryId: ID!) {\n    journalEntry(entryKey: $journalEntryId) {\n      entryKey\n      entry {\n        date\n      }\n    }\n  }\n": types.BreadcrumbJournalEntryQueryDocument,
    "\n  query DailyJournal {\n    recentJournalEntries {\n      entryKey\n    }\n  }\n": types.DailyJournalDocument,
    "\n  query JournalEntryToday($entryKey: ID!) {\n    journalEntry(entryKey: $entryKey) {\n      entryKey\n    }\n  }\n": types.JournalEntryTodayDocument,
    "\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      date\n      highlights {\n        id\n        hue\n      }\n    }\n  }\n": types.DigestDocument,
    "\n  query HighlightBoxButtons($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      importanceRatings {\n        value\n        day {\n          day\n        }\n      }\n      currentImportance\n    }\n  }\n": types.HighlightBoxButtonsDocument,
    "\n  query HighlightComment($commentId: ID!) {\n    comment(id: $commentId) {\n      id\n      commentEntry {\n        entry {\n          entryKey\n          htmlString\n        }\n      }\n    }\n  }\n": types.HighlightCommentDocument,
    "\n  query HighlightDetail($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n      history {\n        dateCreated\n      }\n    }\n  }\n": types.HighlightDetailDocument,
    "\n  query HighlightDetailCommentsSectionQuery($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        commentEntry {\n          entry {\n            entryKey\n            htmlString\n          }\n        }\n      }\n    }\n  }\n": types.HighlightDetailCommentsSectionQueryDocument,
    "\n  query HighlightExcerptQuery($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n    }\n  }\n": types.HighlightExcerptQueryDocument,
    "\n  query HighlightRelationsTable($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      entry {\n        entryKey\n        date\n      }\n      outgoingRelations {\n        __typename\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n": types.HighlightRelationsTableDocument,
    "\n  query HighlightTag($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      hue\n      outgoingRelations {\n        id\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n": types.HighlightTagDocument,
    "\n  query HighlightsList($highlightIds: [ID!]!, $sort: HighlightSortType) {\n    highlights(ids: $highlightIds, sort: $sort) {\n      id\n      history {\n        dateCreated\n      }\n      entry {\n        entryKey\n        date\n      }\n      currentImportance\n      outgoingRelations {\n        __typename\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n": types.HighlightsListDocument,
    "\n  query JournalDateRangeEntryKeys {\n    journalEntryKeys\n  }\n": types.JournalDateRangeEntryKeysDocument,
    "\n  query JournalTitle {\n    journalTitle\n  }\n": types.JournalTitleDocument,
    "\n  query ArcChooser {\n    arcs {\n      id\n      color\n      name\n    }\n  }\n": types.ArcChooserDocument,
    "\n  query HighlightAssignmentPlugin($entryKey: ID!) {\n    entry (entryKey: $entryKey) {\n      highlights {\n        id\n        entry {\n          entryKey\n          date\n        }\n        hue\n      }\n    }\n  }\n": types.HighlightAssignmentPluginDocument,
    "\n  query IpsumEditor($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      htmlString\n      entryType\n    }\n  }\n": types.IpsumEditorDocument,
    "\n  query UseHighlightSearchHighlightArcs($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      outgoingRelations {\n        id\n        object {\n          ... on Arc {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.UseHighlightSearchHighlightArcsDocument,
    "\n  query UseHighlightSearch($searchCriteria: SearchCriteria!) {\n    searchHighlights(criteria: $searchCriteria) {\n      id\n      entry {\n        entryKey\n        date\n      }\n    }\n  }\n": types.UseHighlightSearchDocument,
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
export function gql(source: "\n  query ArcChipConnectedQuery($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n    }\n  }\n"): (typeof documents)["\n  query ArcChipConnectedQuery($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcDetailContext($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      arcEntry {\n        entry {\n          entryKey\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ArcDetailContext($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      arcEntry {\n        entry {\n          entryKey\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcDetailPrefsBox($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n    }\n  } \n"): (typeof documents)["\n  query ArcDetailPrefsBox($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n    }\n  } \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcSearchAutocomplete {\n    arcs(sort: ALPHA_DESC) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query ArcSearchAutocomplete {\n    arcs(sort: ALPHA_DESC) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BreadcrumbJournalEntryQuery($journalEntryId: ID!) {\n    journalEntry(entryKey: $journalEntryId) {\n      entryKey\n      entry {\n        date\n      }\n    }\n  }\n"): (typeof documents)["\n  query BreadcrumbJournalEntryQuery($journalEntryId: ID!) {\n    journalEntry(entryKey: $journalEntryId) {\n      entryKey\n      entry {\n        date\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query DailyJournal {\n    recentJournalEntries {\n      entryKey\n    }\n  }\n"): (typeof documents)["\n  query DailyJournal {\n    recentJournalEntries {\n      entryKey\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query JournalEntryToday($entryKey: ID!) {\n    journalEntry(entryKey: $entryKey) {\n      entryKey\n    }\n  }\n"): (typeof documents)["\n  query JournalEntryToday($entryKey: ID!) {\n    journalEntry(entryKey: $entryKey) {\n      entryKey\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      date\n      highlights {\n        id\n        hue\n      }\n    }\n  }\n"): (typeof documents)["\n  query Digest($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      date\n      highlights {\n        id\n        hue\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightBoxButtons($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      importanceRatings {\n        value\n        day {\n          day\n        }\n      }\n      currentImportance\n    }\n  }\n"): (typeof documents)["\n  query HighlightBoxButtons($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      importanceRatings {\n        value\n        day {\n          day\n        }\n      }\n      currentImportance\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightComment($commentId: ID!) {\n    comment(id: $commentId) {\n      id\n      commentEntry {\n        entry {\n          entryKey\n          htmlString\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightComment($commentId: ID!) {\n    comment(id: $commentId) {\n      id\n      commentEntry {\n        entry {\n          entryKey\n          htmlString\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightDetail($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n      history {\n        dateCreated\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightDetail($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n      history {\n        dateCreated\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightDetailCommentsSectionQuery($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        commentEntry {\n          entry {\n            entryKey\n            htmlString\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightDetailCommentsSectionQuery($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        commentEntry {\n          entry {\n            entryKey\n            htmlString\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightExcerptQuery($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n    }\n  }\n"): (typeof documents)["\n  query HighlightExcerptQuery($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightRelationsTable($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      entry {\n        entryKey\n        date\n      }\n      outgoingRelations {\n        __typename\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightRelationsTable($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      entry {\n        entryKey\n        date\n      }\n      outgoingRelations {\n        __typename\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightTag($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      hue\n      outgoingRelations {\n        id\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightTag($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      hue\n      outgoingRelations {\n        id\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightsList($highlightIds: [ID!]!, $sort: HighlightSortType) {\n    highlights(ids: $highlightIds, sort: $sort) {\n      id\n      history {\n        dateCreated\n      }\n      entry {\n        entryKey\n        date\n      }\n      currentImportance\n      outgoingRelations {\n        __typename\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightsList($highlightIds: [ID!]!, $sort: HighlightSortType) {\n    highlights(ids: $highlightIds, sort: $sort) {\n      id\n      history {\n        dateCreated\n      }\n      entry {\n        entryKey\n        date\n      }\n      currentImportance\n      outgoingRelations {\n        __typename\n        predicate\n        object {\n          ... on Arc {\n            id\n            color\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query JournalDateRangeEntryKeys {\n    journalEntryKeys\n  }\n"): (typeof documents)["\n  query JournalDateRangeEntryKeys {\n    journalEntryKeys\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query JournalTitle {\n    journalTitle\n  }\n"): (typeof documents)["\n  query JournalTitle {\n    journalTitle\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcChooser {\n    arcs {\n      id\n      color\n      name\n    }\n  }\n"): (typeof documents)["\n  query ArcChooser {\n    arcs {\n      id\n      color\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightAssignmentPlugin($entryKey: ID!) {\n    entry (entryKey: $entryKey) {\n      highlights {\n        id\n        entry {\n          entryKey\n          date\n        }\n        hue\n      }\n    }\n  }\n"): (typeof documents)["\n  query HighlightAssignmentPlugin($entryKey: ID!) {\n    entry (entryKey: $entryKey) {\n      highlights {\n        id\n        entry {\n          entryKey\n          date\n        }\n        hue\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IpsumEditor($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      htmlString\n      entryType\n    }\n  }\n"): (typeof documents)["\n  query IpsumEditor($entryKey: ID!) {\n    entry(entryKey: $entryKey) {\n      entryKey\n      htmlString\n      entryType\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseHighlightSearchHighlightArcs($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      outgoingRelations {\n        id\n        object {\n          ... on Arc {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query UseHighlightSearchHighlightArcs($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      outgoingRelations {\n        id\n        object {\n          ... on Arc {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseHighlightSearch($searchCriteria: SearchCriteria!) {\n    searchHighlights(criteria: $searchCriteria) {\n      id\n      entry {\n        entryKey\n        date\n      }\n    }\n  }\n"): (typeof documents)["\n  query UseHighlightSearch($searchCriteria: SearchCriteria!) {\n    searchHighlights(criteria: $searchCriteria) {\n      id\n      entry {\n        entryKey\n        date\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;