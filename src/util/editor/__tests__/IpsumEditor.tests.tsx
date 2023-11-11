import { ApolloProvider } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { client, EntryType } from "util/apollo";
import { IpsumEditor } from "../IpsumEditor";

jest.mock("util/placeholders", () => ({
  placeholderForDate: () => "placeholder",
}));

describe("IpsumEditor", () => {
  describe("Core editor", () => {
    it("should render", async () => {
      render(
        <ApolloProvider client={client}>
          <IpsumEditor
            entryKey="test_entry"
            metadata={{ entryType: EntryType.Journal }}
          ></IpsumEditor>
        </ApolloProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("placeholder")).toBeInTheDocument();
      });
    });
  });

  describe("Toolbar", () => {
    it("should set bold text", async () => {
      render(
        <ApolloProvider client={client}>
          <IpsumEditor
            entryKey="test_entry"
            metadata={{ entryType: EntryType.Journal }}
          ></IpsumEditor>
        </ApolloProvider>
      );

      let contentEditable: HTMLElement;

      await waitFor(() => {
        contentEditable = screen.getByRole("textbox");
      });

      await userEvent.click(contentEditable);
      await userEvent.keyboard("test text");
    });
  });

  describe("ArcChooser", () => {});
});
