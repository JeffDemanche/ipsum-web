import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { EntryEditor } from "components/atoms/EntryEditor";
import React from "react";

import { FormattingControls } from "../FormattingControls";
import { FormattingControlsProvider } from "../FormattingControlsContext";

const WithEditor = () => {
  return (
    <FormattingControlsProvider>
      <FormattingControls />
      <EntryEditor />
    </FormattingControlsProvider>
  );
};

describe("FormattingControls", () => {
  it("should render", async () => {
    render(<WithEditor />);

    await waitFor(() => {});
  });

  describe("content highlighting", () => {
    /**
     * Lexical with RTL is buggy and the test fails.
     */
    it.skip("should highlight the selected text", async () => {
      const createHighlight = jest.fn(() => "highlight-id");
      const highlightsMap = {
        "highlight-id": { id: "highlight-id", hue: 0 },
      };
      render(
        <FormattingControlsProvider>
          <FormattingControls />
          <EntryEditor
            // Lexical is buggy in the RTL environment unless you give the editor some initial content
            initialHtmlString="<p>It is written:</p>"
            highlightsMap={highlightsMap}
            createHighlight={createHighlight}
          />
        </FormattingControlsProvider>
      );
      const editor = await screen.findByRole("textbox");
      await waitFor(async () => {
        await userEvent.click(editor);
        await userEvent.type(
          editor,
          "each step I take feels like a liberation from the shackles of worldly attachments"
        );
      });
      await waitFor(async () => {
        await userEvent.click(
          await screen.findByRole("button", { name: "highlight" })
        );
        expect(createHighlight).toHaveBeenCalled();
      });

      expect(createHighlight).toHaveBeenCalled();
      const span = screen.queryByText(
        "It is written:each step I take feels like a liberation from the shackles of worldly attachments"
      );
      expect(span).toBeInTheDocument();
      expect(span.parentElement).toHaveAttribute(
        "data-highlight-id",
        "highlight-id"
      );
    });
  });
});
