import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("should call createHighlight callback when create highlight button is clicked", async () => {
    const createHighlight = jest.fn();

    render(
      <FormattingControlsProvider>
        <FormattingControls />
        <EntryEditor createHighlight={createHighlight} />
      </FormattingControlsProvider>
    );

    await waitFor(async () => {
      fireEvent.click(await screen.findByRole("button", { name: "highlight" }));
    });

    expect(createHighlight).toHaveBeenCalled();
  });
});
