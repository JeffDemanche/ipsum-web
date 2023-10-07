import { ApolloProvider } from "@apollo/client";
import { render } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import {
  mockArcs,
  mockEntries,
  mockHighlights,
  mockRelations,
} from "util/apollo/__tests__/apollo-test-utils";
import { stringifyContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
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
        trackedContentState: IpsumTimeMachine.create(
          stringifyContentState(entry_1_content)
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

  it("displays the entire text of a highlight in a DraftJS editor", () => {
    render(
      <ApolloProvider client={client}>
        <HighlightExcerpt highlightId="highlight_1" />
      </ApolloProvider>
    );
  });
});
