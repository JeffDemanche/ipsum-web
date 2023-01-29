import { render, screen } from "@testing-library/react";
import React from "react";
import { MockInMemoryStateProvider } from "state/in-memory/__tests__/MockInMemoryStateProvider";
import { IpsumEntityTransformer } from "util/entities";
import { createEditorStateFromFormat } from "util/__tests__/editor-utils";
import { ArcDecoration } from "../ArcDecoration";

describe("ArcDecoration", () => {
  it("renders a highlighted span with underline for an entity which contains one arc", async () => {
    const editorState = createEditorStateFromFormat(
      "<p>the quick [brown fox] jumped over the lazy dog</p>"
    );

    const contentStateWithArc = new IpsumEntityTransformer(
      editorState.getCurrentContent()
    ).applyEntityData(editorState.getSelection(), "textArcAssignments", {
      arcId: "arc_id",
      arcAssignmentId: "assgn_id",
    }).contentState;

    const { unmount } = render(
      <MockInMemoryStateProvider
        state={{
          arc: { arc_id: { color: 0, id: "arc_id", name: "foxes" } },
        }}
      >
        <ArcDecoration
          blockKey={contentStateWithArc.getFirstBlock().getKey()}
          contentState={contentStateWithArc}
          decoratedText="brown fox"
          start={10}
          end={19}
          entityKey={contentStateWithArc.getLastCreatedEntityKey()}
          offsetKey=""
        >
          brown fox
        </ArcDecoration>
      </MockInMemoryStateProvider>
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
