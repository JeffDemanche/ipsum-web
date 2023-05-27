import { ApolloProvider } from "@apollo/client";
import { render, screen } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import {
  mockArcs,
  mockHighlights,
  mockRelations,
} from "util/apollo/__tests__/apollo-test-utils";
import { IpsumEntityTransformer } from "util/entities";
import { createEditorStateFromFormat } from "util/__tests__/editor-utils";
import { HighlightDecoration } from "../HighlightDecoration";

describe("HighlightDecoration", () => {
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
    mockHighlights({
      highlight_id: {
        __typename: "Highlight",
        id: "highlight_id",
        entry: "",
        outgoingRelations: ["relation_id"],
      },
    });
    mockRelations({
      relation_id: {
        __typename: "Relation",
        id: "relation_id",
        object: "arc_id",
        objectType: "Arc",
        predicate: "relates to",
        subject: "highlight_id",
        subjectType: "Highlight",
      },
    });
  });

  it("renders a highlighted span with underline for an entity which contains one arc", async () => {
    const editorState = createEditorStateFromFormat(
      "<p>the quick [brown fox] jumped over the lazy dog</p>"
    );

    const contentStateWithArc = new IpsumEntityTransformer(
      editorState.getCurrentContent()
    ).applyEntityData(editorState.getSelection(), "textArcAssignments", {
      arcId: "arc_id",
      arcAssignmentId: "highlight_id",
    }).contentState;

    const { unmount } = render(
      <ApolloProvider client={client}>
        <HighlightDecoration
          blockKey={contentStateWithArc.getFirstBlock().getKey()}
          contentState={contentStateWithArc}
          decoratedText="brown fox"
          start={10}
          end={19}
          entityKey={contentStateWithArc.getLastCreatedEntityKey()}
          offsetKey=""
        >
          brown fox
        </HighlightDecoration>
      </ApolloProvider>
    );
    const decorationSpan = await screen.findByText("brown fox");
    // offset-x offset-y blur-radius color
    expect(decorationSpan.style.boxShadow).toEqual(
      "0 2px 0 0 rgba(255, 0, 0, 0.25)"
    );
    // backgroundColor gets converted to RGBA for some reason
    expect(decorationSpan.style.backgroundColor).toEqual(
      "rgba(255, 0, 0, 0.05)"
    );

    unmount();
  });
});
