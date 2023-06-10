import { ApolloProvider } from "@apollo/client";
import { renderHook } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import { mockArcs } from "util/apollo/__tests__/apollo-test-utils";
import { useSearchArcs } from "../useSearchArcs";

function wrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

describe("ArcSearch", () => {
  it("returns all arcs if query is empty", () => {
    mockArcs({
      arc_1: {
        __typename: "Arc",
        id: "arc_1",
        name: "Arc one",
        color: 0,
        incomingRelations: [],
        outgoingRelations: [],
      },
    });

    const { result } = renderHook(() => useSearchArcs({ query: "" }), {
      wrapper,
    });

    expect(result.current.returnedArcs.length).toBe(1);
  });
});
