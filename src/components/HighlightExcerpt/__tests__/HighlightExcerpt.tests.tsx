import { ApolloProvider } from "@apollo/client";
import { render } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import {
  mockEntries,
  mockHighlights,
} from "util/apollo/__tests__/apollo-test-utils";
import { stringifyContentState } from "util/content-state";
import { IpsumEntityTransformer } from "util/entities";
import { createEditorStateFromFormat } from "util/__tests__/editor-utils";
import { HighlightExcerpt } from "../HighlightExcerpt";

describe("HighlightExcerpt", () => {
  const entry_1_editor = createEditorStateFromFormat(
    "<p>this text is unselected</p><p>[this text is highlighted]</p>"
  );
  const entry_1_content = new IpsumEntityTransformer(
    entry_1_editor.getCurrentContent()
  ).applyEntityData(entry_1_editor.getSelection(), "textArcAssignments", {
    arcAssignmentId: "highlight_1",
    arcId: "arc_1",
  }).contentState;

  beforeEach(() => {
    mockEntries({
      entry_1: {
        __typename: "Entry",
        entryKey: "entry_1",
        date: "",
        contentState: stringifyContentState(entry_1_content),
      },
    });
    mockHighlights({
      highlight_1: {
        __typename: "Highlight",
        id: "highlight_1",
        entry: "entry_1",
        arc: "",
      },
    });
  });

  it("displays the entire text of a highlight in a DraftJS editor", () => {
    render(
      <ApolloProvider client={client}>
        <HighlightExcerpt highlightId="highlight_1" />
      </ApolloProvider>
    );
  });
});
