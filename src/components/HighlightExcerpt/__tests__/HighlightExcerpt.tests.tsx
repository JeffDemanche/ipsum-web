import { ApolloProvider } from "@apollo/client";
import { render, screen } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import {
  mockArcs,
  mockEntries,
  mockHighlights,
  mockRelations,
} from "util/apollo/__tests__/apollo-test-utils";
import { IpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";

import { HighlightExcerptConnected } from "../HighlightExcerptConnected";

describe("HighlightExcerpt", () => {
  beforeEach(() => {
    mockArcs({
      arc_id: {
        __typename: "Arc",
        color: 0,
        id: "arc_id",
        name: "foxes",
        incomingRelations: ["relation_id"],
        outgoingRelations: [],
      },
    });
    mockEntries({
      "1/1/2020": {
        __typename: "Entry",
        entryKey: "1/1/2020",
        trackedHTMLString: IpsumTimeMachine.create(
          '<div data-highlight-id="highlight_1"><p>this text is highlighted</p><p>on both lines</p></div>'
        ).toString(),
        history: {
          __typename: "History",
          dateCreated: IpsumDateTime.fromString(
            "1/1/2020",
            "entry-printed-date"
          ).toString("iso"),
        },
      },
      "1/2/2020": {
        __typename: "Entry",
        entryKey: "1/2/2020",
        trackedHTMLString: IpsumTimeMachine.create(
          '<p>first block</p><div data-highlight-id="highlight_2"><p>second block</p></div><p>third block</p>'
        ).toString(),
        history: {
          __typename: "History",
          dateCreated: IpsumDateTime.fromString(
            "1/1/2020",
            "entry-printed-date"
          ).toString("iso"),
        },
      },
    });
    mockHighlights({
      highlight_1: {
        __typename: "Highlight",
        id: "highlight_1",
        entry: "1/1/2020",
        outgoingRelations: ["relation_1"],
      },
      highlight_2: {
        __typename: "Highlight",
        id: "highlight_2",
        entry: "1/2/2020",
        outgoingRelations: ["relation_1"],
      },
    });
    mockRelations({
      relation_1: {
        __typename: "Relation",
        id: "relation_1",
        object: "arc_id",
        objectType: "Arc",
        predicate: "predicate_1",
        subject: "highlight_1",
        subjectType: "Highlight",
      },
    });
  });

  it("only shows highlighted block when there are other blocks present", () => {
    render(
      <ApolloProvider client={client}>
        <HighlightExcerptConnected highlightId="highlight_2" />
      </ApolloProvider>
    );

    expect(screen.getByText("second block")).toBeInTheDocument();
    expect(screen.queryByText("first block")).not.toBeInTheDocument();
    expect(screen.queryByText("third block")).not.toBeInTheDocument();
  });
});
