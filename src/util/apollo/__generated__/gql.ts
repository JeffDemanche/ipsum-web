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
    "\n  query UseCommentsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        sourceEntry {\n          entry {\n            entryKey\n            highlights {\n              id\n              number\n              hue\n              outgoingRelations {\n                object {\n                  ... on Arc {\n                    name\n                  }\n                }\n              }\n            }\n            htmlString\n          }\n        }\n      }\n    }\n  }\n": types.UseCommentsConnectedDocument,
    "\n  query UseHighlightBlurbConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n      hue\n      number\n      objectText\n      importanceRatings {\n        day {\n          day\n        }\n      }\n      outgoingRelations {\n        id\n        predicate\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      object {\n        __typename\n        ... on Arc {\n          id\n        }\n        ... on Day {\n          day\n        }\n        ... on Comment {\n          id\n          objectHighlight {\n            id\n          }\n        }\n      }\n    }\n  }  \n": types.UseHighlightBlurbConnectedDocument,
    "\n  query UseHighlightFunctionButtonsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      hue\n    } \n  }\n": types.UseHighlightFunctionButtonsConnectedDocument,
    "\n  query UseHighlightReviewStateConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      srsCard  {\n        id\n        upForReview\n        history {\n          dateCreated\n        }\n        ease\n        reviews {\n          day {\n            day\n          }\n          rating\n          easeBefore\n          easeAfter\n          intervalBefore\n          intervalAfter\n        }\n        prospectiveIntervals(day: null)\n      }\n    }\n  }  \n": types.UseHighlightReviewStateConnectedDocument,
    "\n  query UseHighlightSRSButtonsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      srsCard  {\n        id\n        prospectiveIntervals(day: null)\n      }\n    }\n  }  \n": types.UseHighlightSrsButtonsConnectedDocument,
    "\n  query LexicalFilterSelectorConnectedDataOnDay($day: String!) {\n    day(day: $day) @client {\n      journalEntry {\n        entry {\n          entryKey\n          highlights {\n            id\n            arcs {\n              id\n              name\n              color\n            }\n          }\n        }\n      }\n    }\n  }\n": types.LexicalFilterSelectorConnectedDataOnDayDocument,
    "\n  query LexicalFilterSelectorConnectedArcByIdOrName($id: ID!, $name: String!) {\n    arc(id: $id) {\n      id\n      name\n      color\n    }\n    arcByName(name: $name) {\n      id\n      name\n      color\n    }\n  }\n": types.LexicalFilterSelectorConnectedArcByIdOrNameDocument,
    "\n  query UseRelationChooserConnected($search: String!) {\n    searchArcsByName(search: $search) {\n      id\n      name\n      color\n    }\n  }\n": types.UseRelationChooserConnectedDocument,
    "\n  query ArcPage($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      outgoingRelations {\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      arcEntry {\n        entry {\n          entryKey\n          htmlString\n          highlights {\n            id\n            number\n            hue\n            outgoingRelations {\n              id\n              predicate\n              object {\n                ... on Arc {\n                  id\n                  name\n                  color\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ArcPageDocument,
    "\n  query BrowserDrawerHighlightsSearch($program: String!) {\n    searchHighlights(program: $program) {\n      id\n      history {\n        dateCreated\n      }\n    }\n  }\n": types.BrowserDrawerHighlightsSearchDocument,
    "\n  query DailyJournalEntryQuery($entryKey: ID!, $day: String!) {\n    journalEntryDates(includeEmpty: false)\n    journalEntry(entryKey: $entryKey) {\n      entryKey\n      entry {\n        htmlString\n        highlights {\n          id\n          hue\n          number\n          arcs {\n            id\n            name\n          }\n        }\n      }\n    }\n    day(day: $day) {\n      comments {\n        id\n        objectHighlight {\n          id\n          hue\n          arcs {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n": types.DailyJournalEntryQueryDocument,
    "\n  query HighlightPage($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      arcs {\n        id\n        name\n      }\n      hue\n      number\n      objectText\n      entry {\n        entryKey\n        htmlString\n      }\n      outgoingRelations {\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        objectHighlight {\n          id\n          number\n          hue\n          objectText\n          outgoingRelations {\n            id\n            predicate\n            object {\n              ... on Arc {\n                id\n                name\n                color\n              }\n            }\n          }\n        }\n      }\n    }\n  }  \n": types.HighlightPageDocument,
    "\n  query JournalSettingsDrawer {\n    journalTitle\n  } \n": types.JournalSettingsDrawerDocument,
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
export function gql(source: "\n  query UseCommentsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        sourceEntry {\n          entry {\n            entryKey\n            highlights {\n              id\n              number\n              hue\n              outgoingRelations {\n                object {\n                  ... on Arc {\n                    name\n                  }\n                }\n              }\n            }\n            htmlString\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query UseCommentsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        sourceEntry {\n          entry {\n            entryKey\n            highlights {\n              id\n              number\n              hue\n              outgoingRelations {\n                object {\n                  ... on Arc {\n                    name\n                  }\n                }\n              }\n            }\n            htmlString\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseHighlightBlurbConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n      hue\n      number\n      objectText\n      importanceRatings {\n        day {\n          day\n        }\n      }\n      outgoingRelations {\n        id\n        predicate\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      object {\n        __typename\n        ... on Arc {\n          id\n        }\n        ... on Day {\n          day\n        }\n        ... on Comment {\n          id\n          objectHighlight {\n            id\n          }\n        }\n      }\n    }\n  }  \n"): (typeof documents)["\n  query UseHighlightBlurbConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      excerpt\n      hue\n      number\n      objectText\n      importanceRatings {\n        day {\n          day\n        }\n      }\n      outgoingRelations {\n        id\n        predicate\n        object {\n          __typename\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      object {\n        __typename\n        ... on Arc {\n          id\n        }\n        ... on Day {\n          day\n        }\n        ... on Comment {\n          id\n          objectHighlight {\n            id\n          }\n        }\n      }\n    }\n  }  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseHighlightFunctionButtonsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      hue\n    } \n  }\n"): (typeof documents)["\n  query UseHighlightFunctionButtonsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      hue\n    } \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseHighlightReviewStateConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      srsCard  {\n        id\n        upForReview\n        history {\n          dateCreated\n        }\n        ease\n        reviews {\n          day {\n            day\n          }\n          rating\n          easeBefore\n          easeAfter\n          intervalBefore\n          intervalAfter\n        }\n        prospectiveIntervals(day: null)\n      }\n    }\n  }  \n"): (typeof documents)["\n  query UseHighlightReviewStateConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      srsCard  {\n        id\n        upForReview\n        history {\n          dateCreated\n        }\n        ease\n        reviews {\n          day {\n            day\n          }\n          rating\n          easeBefore\n          easeAfter\n          intervalBefore\n          intervalAfter\n        }\n        prospectiveIntervals(day: null)\n      }\n    }\n  }  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseHighlightSRSButtonsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      srsCard  {\n        id\n        prospectiveIntervals(day: null)\n      }\n    }\n  }  \n"): (typeof documents)["\n  query UseHighlightSRSButtonsConnected($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      srsCard  {\n        id\n        prospectiveIntervals(day: null)\n      }\n    }\n  }  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LexicalFilterSelectorConnectedDataOnDay($day: String!) {\n    day(day: $day) @client {\n      journalEntry {\n        entry {\n          entryKey\n          highlights {\n            id\n            arcs {\n              id\n              name\n              color\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query LexicalFilterSelectorConnectedDataOnDay($day: String!) {\n    day(day: $day) @client {\n      journalEntry {\n        entry {\n          entryKey\n          highlights {\n            id\n            arcs {\n              id\n              name\n              color\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LexicalFilterSelectorConnectedArcByIdOrName($id: ID!, $name: String!) {\n    arc(id: $id) {\n      id\n      name\n      color\n    }\n    arcByName(name: $name) {\n      id\n      name\n      color\n    }\n  }\n"): (typeof documents)["\n  query LexicalFilterSelectorConnectedArcByIdOrName($id: ID!, $name: String!) {\n    arc(id: $id) {\n      id\n      name\n      color\n    }\n    arcByName(name: $name) {\n      id\n      name\n      color\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UseRelationChooserConnected($search: String!) {\n    searchArcsByName(search: $search) {\n      id\n      name\n      color\n    }\n  }\n"): (typeof documents)["\n  query UseRelationChooserConnected($search: String!) {\n    searchArcsByName(search: $search) {\n      id\n      name\n      color\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ArcPage($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      outgoingRelations {\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      arcEntry {\n        entry {\n          entryKey\n          htmlString\n          highlights {\n            id\n            number\n            hue\n            outgoingRelations {\n              id\n              predicate\n              object {\n                ... on Arc {\n                  id\n                  name\n                  color\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ArcPage($arcId: ID!) {\n    arc(id: $arcId) {\n      id\n      name\n      color\n      outgoingRelations {\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      arcEntry {\n        entry {\n          entryKey\n          htmlString\n          highlights {\n            id\n            number\n            hue\n            outgoingRelations {\n              id\n              predicate\n              object {\n                ... on Arc {\n                  id\n                  name\n                  color\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BrowserDrawerHighlightsSearch($program: String!) {\n    searchHighlights(program: $program) {\n      id\n      history {\n        dateCreated\n      }\n    }\n  }\n"): (typeof documents)["\n  query BrowserDrawerHighlightsSearch($program: String!) {\n    searchHighlights(program: $program) {\n      id\n      history {\n        dateCreated\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query DailyJournalEntryQuery($entryKey: ID!, $day: String!) {\n    journalEntryDates(includeEmpty: false)\n    journalEntry(entryKey: $entryKey) {\n      entryKey\n      entry {\n        htmlString\n        highlights {\n          id\n          hue\n          number\n          arcs {\n            id\n            name\n          }\n        }\n      }\n    }\n    day(day: $day) {\n      comments {\n        id\n        objectHighlight {\n          id\n          hue\n          arcs {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query DailyJournalEntryQuery($entryKey: ID!, $day: String!) {\n    journalEntryDates(includeEmpty: false)\n    journalEntry(entryKey: $entryKey) {\n      entryKey\n      entry {\n        htmlString\n        highlights {\n          id\n          hue\n          number\n          arcs {\n            id\n            name\n          }\n        }\n      }\n    }\n    day(day: $day) {\n      comments {\n        id\n        objectHighlight {\n          id\n          hue\n          arcs {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HighlightPage($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      arcs {\n        id\n        name\n      }\n      hue\n      number\n      objectText\n      entry {\n        entryKey\n        htmlString\n      }\n      outgoingRelations {\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        objectHighlight {\n          id\n          number\n          hue\n          objectText\n          outgoingRelations {\n            id\n            predicate\n            object {\n              ... on Arc {\n                id\n                name\n                color\n              }\n            }\n          }\n        }\n      }\n    }\n  }  \n"): (typeof documents)["\n  query HighlightPage($highlightId: ID!) {\n    highlight(id: $highlightId) {\n      id\n      arcs {\n        id\n        name\n      }\n      hue\n      number\n      objectText\n      entry {\n        entryKey\n        htmlString\n      }\n      outgoingRelations {\n        id\n        predicate\n        object {\n          ... on Arc {\n            id\n            name\n            color\n          }\n        }\n      }\n      comments {\n        id\n        history {\n          dateCreated\n        }\n        objectHighlight {\n          id\n          number\n          hue\n          objectText\n          outgoingRelations {\n            id\n            predicate\n            object {\n              ... on Arc {\n                id\n                name\n                color\n              }\n            }\n          }\n        }\n      }\n    }\n  }  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query JournalSettingsDrawer {\n    journalTitle\n  } \n"): (typeof documents)["\n  query JournalSettingsDrawer {\n    journalTitle\n  } \n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;