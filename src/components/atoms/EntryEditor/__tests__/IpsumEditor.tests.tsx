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
            defaultEntryKey="test_entry"
            createEntry={() => "test_entry"}
            updateEntry={() => true}
            deleteEntry={() => {}}
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
            defaultEntryKey="test_entry"
            createEntry={() => "test_entry"}
            updateEntry={() => true}
            deleteEntry={() => {}}
            metadata={{ entryType: EntryType.Journal }}
          ></IpsumEditor>
        </ApolloProvider>
      );

      await waitFor(() => {});
    });
  });

  describe("ArcChooser", () => {});
});
