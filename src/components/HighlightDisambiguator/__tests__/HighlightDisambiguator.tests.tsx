import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { HighlightDisambiguator } from "../HighlightDisambiguator";
import {
  mockArcs,
  mockHighlights,
  mockRelations,
} from "util/apollo/__tests__/apollo-test-utils";
import { ApolloProvider } from "@apollo/client";
import { client } from "util/apollo";

const TestDisambiguator: React.FunctionComponent<{
  open: boolean;
  onArcSelected?: (arcId: string) => void;
}> = ({ open, onArcSelected: onHighlightSelected }) => {
  const [anchor, setAnchor] = useState<HTMLDivElement>(null);
  return (
    <ApolloProvider client={client}>
      <div
        ref={(el) => {
          setAnchor(el);
        }}
      ></div>
      {anchor && (
        <HighlightDisambiguator
          open={open}
          anchorEl={anchor}
          onHighlightSelected={onHighlightSelected}
          highlightIds={["highlight_1", "highlight_2"]}
        ></HighlightDisambiguator>
      )}
    </ApolloProvider>
  );
};

describe("HighlightDisambiguator", () => {
  beforeEach(() => {
    mockArcs({
      arc_1: {
        __typename: "Arc",
        id: "arc_1",
        color: 0,
        name: "Arc one",
        incomingRelations: ["relation_1"],
        outgoingRelations: [],
      },
      arc_2: {
        __typename: "Arc",
        id: "arc_2",
        color: 100,
        name: "Arc two",
        incomingRelations: ["relation_2"],
        outgoingRelations: [],
      },
    });
    mockHighlights({
      highlight_1: {
        __typename: "Highlight",
        entry: "",
        id: "highlight_1",
        outgoingRelations: ["relation_1"],
      },
      highlight_2: {
        __typename: "Highlight",
        entry: "",
        id: "highlight_2",
        outgoingRelations: ["relation_2"],
      },
    });
    mockRelations({
      relation_1: {
        __typename: "Relation",
        id: "relation_1",
        object: "arc_1",
        objectType: "Arc",
        predicate: "predicate",
        subject: "highlight_1",
        subjectType: "Highlight",
      },
      relation_2: {
        __typename: "Relation",
        id: "relation_2",
        object: "arc_2",
        objectType: "Arc",
        predicate: "predicate",
        subject: "highlight_2",
        subjectType: "Highlight",
      },
    });
  });

  it("has links for both arcs with correct hues", async () => {
    const { unmount } = render(<TestDisambiguator open></TestDisambiguator>);

    const arc1 = await screen.findByRole("link", { name: "Arc one" });
    const arc2 = await screen.findByRole("link", { name: "Arc two" });

    expect(arc1).toBeInTheDocument();
    expect(arc1.style.textDecorationColor).toEqual("rgba(115, 38, 38, 1)");
    expect(arc2).toBeInTheDocument();
    expect(arc2.style.textDecorationColor).toEqual("rgba(64, 115, 38, 1)");

    unmount();
  });

  it("selects arc on click", async () => {
    const mockOnHighlightSelected = jest.fn();

    const { unmount } = render(
      <TestDisambiguator
        open
        onArcSelected={mockOnHighlightSelected}
      ></TestDisambiguator>
    );

    expect(mockOnHighlightSelected).not.toHaveBeenCalled();
    const arc1 = await screen.findByRole("link", { name: "Arc one" });
    fireEvent.click(arc1);
    expect(mockOnHighlightSelected).toHaveBeenCalledWith("highlight_1");

    unmount();
  });
});
