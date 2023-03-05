import { render } from "@testing-library/react";
import React from "react";
import { InMemoryState } from "state/in-memory";
import {
  initializeDefaultDocument,
  initializeDefaultInMemoryState,
} from "state/in-memory/in-memory-state";
import { MockInMemoryStateProvider } from "state/in-memory/__tests__/MockInMemoryStateProvider";
import { stringifyContentState } from "util/content-state";
import { IpsumEntityTransformer } from "util/entities";
import { createEditorStateFromFormat } from "util/__tests__/editor-utils";
import { HighlightExcerpt } from "../HighlightExcerpt";

describe("HighlightExcerpt", () => {
  let ims: InMemoryState;

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
    ims = {
      ...initializeDefaultInMemoryState(),
      entry: {
        entry_1: {
          ...initializeDefaultDocument("entry"),
          contentState: stringifyContentState(entry_1_content),
        },
      },
      highlight: {
        highlight_1: {
          ...initializeDefaultDocument("highlight"),
          id: "highlight_1",
          entryKey: "entry_1",
        },
      },
    };
  });

  it("displays the entire text of a highlight in a DraftJS editor", () => {
    render(
      <MockInMemoryStateProvider state={ims}>
        <HighlightExcerpt highlightId="highlight_1" />
      </MockInMemoryStateProvider>
    );
  });
});
