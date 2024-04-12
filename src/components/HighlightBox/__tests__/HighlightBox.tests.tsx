import { ApolloProvider } from "@apollo/client";
import { render, screen } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import {
  mockEntries,
  mockHighlights,
} from "util/apollo/__tests__/apollo-test-utils";
import { IpsumTimeMachine } from "util/diff";

import { HighlightBox } from "../HighlightBox";

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
