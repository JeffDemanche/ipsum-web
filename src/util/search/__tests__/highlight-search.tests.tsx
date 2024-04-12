import { ApolloProvider } from "@apollo/client";
import { renderHook } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import {
  mockArcs,
  mockEntries,
  mockHighlights,
  mockRelations,
} from "util/apollo/__tests__/apollo-test-utils";
import { useIpsumSearchParams } from "util/url";
import { IpsumURLSearch } from "util/url/types";

import { useSearchResults } from "../search";

function wrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

jest.mock("util/url", () => ({
  ...jest.requireActual("util/url"),
  useIpsumSearchParams: jest.fn(),
}));

describe("HighlightSearch", () => {
  it("returns sorted incoming highlights from each outgoing arc for the specified highlight when no criteria is provided", () => {
    jest
      .mocked(useIpsumSearchParams)
      .mockReturnValue({} as IpsumURLSearch<"journal">);

    // highlight_1 relates to arc_1 and arc_2
    // highlight_2 relates to arc_2
    // So search results for highlight_1 should include highlight_2
    mockHighlights({
      highlight_1: {
        __typename: "Highlight",
        id: "highlight_1",
        entry: "entry_1",
        outgoingRelations: ["relation_1"],
      },
      highlight_2: {
        __typename: "Highlight",
        id: "highlight_2",
        entry: "entry_1",
        outgoingRelations: ["relation_2"],
      },
    });
    mockRelations({
      relation_1: {
        __typename: "Relation",
        id: "relation_1",
        subjectType: "Highlight",
        subject: "highlight_1",
        predicate: "relates to",
        objectType: "Arc",
        object: "arc_1",
      },
      relation_2: {
        __typename: "Relation",
        id: "relation_2",
        subjectType: "Highlight",
        subject: "highlight_2",
        predicate: "relates to",
        objectType: "Arc",
        object: "arc_1",
      },
      relation_3: {
        __typename: "Relation",
        id: "relation_3",
        subjectType: "Highlight",
        subject: "highlight_2",
        predicate: "relates to",
        objectType: "Arc",
        object: "arc_2",
      },
    });
    mockArcs({
      arc_1: {
        __typename: "Arc",
        id: "arc_1",
        name: "arc1",
        color: 0,
        incomingRelations: ["relation_1", "relation_2"],
        outgoingRelations: [],
      },
      arc_2: {
        __typename: "Arc",
        id: "arc_2",
        name: "arc2",
        color: 0,
        incomingRelations: ["relation_3"],
        outgoingRelations: [],
      },
    });
    mockEntries({
      entry_1: {
        __typename: "Entry",
        entryKey: "entry_1",
      },
    });

    const { result } = renderHook(() => useSearchResults(), { wrapper });

    expect(result.current.searchResults.length).toBe(2);
    expect(result.current.searchResults[0].id).toBe("highlight_2");
    expect(result.current.searchResults[1].id).toBe("highlight_1");
  });
});
