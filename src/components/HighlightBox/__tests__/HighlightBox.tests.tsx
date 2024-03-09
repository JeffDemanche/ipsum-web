import React from "react";
import { HighlightBox } from "../HighlightBox";
import { render, screen } from "@testing-library/react";
import {
  mockEntries,
  mockHighlights,
} from "util/apollo/__tests__/apollo-test-utils";
import { IpsumTimeMachine } from "util/diff";
import { ApolloProvider } from "@apollo/client";
import { client } from "util/apollo";

describe("HighlightBox", () => {
  beforeEach(() => {
    mockEntries({
      "2021-01-01": {
        entryKey: "2021-01-01",
        trackedHTMLString: IpsumTimeMachine.create("Test entry").toString(),
        history: {
          __typename: "History",
          dateCreated: "2021-01-01T00:00:00Z",
        },
      },
    });
    mockHighlights({
      highlight_1: { id: "highlight_1", entry: "2021-01-01" },
    });
  });

  it("renders highlight excerpt", () => {
    render(
      <ApolloProvider client={client}>
        <HighlightBox
          highlight={{
            id: "highlight_1",
            currentImportance: 0,
            entry: {
              date: "2021-01-01T00:00:00Z",
            },
            outgoingRelations: [],
          }}
        />
      </ApolloProvider>
    );

    expect(screen.getByText("Test entry")).toBeInTheDocument();
  });
});
