import { ApolloProvider } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
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
            // https://github.com/facebook/lexical/issues/4595#issuecomment-1578872303
            initializeState={() => {
              const root = $getRoot();
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(" "));
              root.append(paragraph);
            }}
            entryKey="test_entry"
            metadata={{ entryType: EntryType.Journal }}
          ></IpsumEditor>
        </ApolloProvider>
      );

      await waitFor(() => {});
    });
  });

  describe("ArcChooser", () => {});
});
