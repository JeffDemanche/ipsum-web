import { ApolloProvider } from "@apollo/client";
import { render } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import { dataToSearchParams, URLLayer } from "util/url";
import { searchParamsToData } from "util/url/urls";
import { DiptychContext, DiptychProvider } from "../DiptychContext";
import { Diptych } from "../types";

const navigateSpy = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => navigateSpy,
  useLocation: jest.fn(),
}));

describe("DiptychContext", () => {
  const setup = ({
    initialUrlLayers,
    onValue,
  }: {
    initialUrlLayers: URLLayer[];
    onValue?: (value: Diptych) => void;
  }) => {
    jest.resetAllMocks();

    const url = new URL("http://www.test.com");
    url.search = dataToSearchParams<"journal">({
      layers: initialUrlLayers,
    });

    delete window.location;
    // @ts-expect-error types, idk
    window.location = { href: url.toString() };

    render(
      <ApolloProvider client={client}>
        <DiptychProvider>
          <DiptychContext.Consumer>
            {(value) => {
              onValue?.(value);
              return <></>;
            }}
          </DiptychContext.Consumer>
        </DiptychProvider>
      </ApolloProvider>
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const navigateCallToData = (call: string) => {
    return searchParamsToData<"journal">(call.split("?")[1]);
  };

  it("initially adds daily journal layer if the URL doesn't contain any layers initially", () => {
    setup({
      initialUrlLayers: [],
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateCallToData(navigateSpy.mock.calls[0][0])).toEqual({
      layers: [{ type: "daily_journal" }],
    });
  });

  describe("pushLayer", () => {
    it("should add a layer to the URL", () => {
      setup({
        initialUrlLayers: [{ type: "daily_journal" }],
        onValue: (value) => {
          value.pushLayer({ type: "arc_detail", arcId: "arc-id" });
        },
      });
      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateCallToData(navigateSpy.mock.calls[0][0])).toEqual({
        layers: [
          { type: "daily_journal" },
          { type: "arc_detail", arcId: "arc-id" },
        ],
      });
    });
  });

  describe("setTopHighlightFrom and setTopHighlightTo", () => {
    it("should add highlightFrom to the top layer", () => {
      setup({
        initialUrlLayers: [{ type: "daily_journal" }],
        onValue: (value) => {
          value.setTopHighlightFrom("highlight_id", "1/1/2021");
        },
      });
      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateCallToData(navigateSpy.mock.calls[0][0])).toEqual({
        layers: [
          {
            type: "daily_journal",
            highlightFrom: "highlight_id",
            highlightFromEntryKey: "1/1/2021",
          },
        ],
      });
    });

    it("should add highlightTo and highlightFrom to the top layer", () => {
      setup({
        initialUrlLayers: [
          {
            type: "daily_journal",
            highlightFrom: "highlight_from_id",
            highlightFromEntryKey: "1/1/2021",
          },
        ],
        onValue: (value) => {
          value.setTopHighlightTo("highlight_to_id", "1/2/2021");
        },
      });
      expect(navigateSpy).toHaveBeenCalledTimes(2);
      expect(navigateCallToData(navigateSpy.mock.calls[0][0])).toEqual({
        layers: [
          {
            type: "daily_journal",
            highlightFrom: "highlight_from_id",
            highlightFromEntryKey: "1/1/2021",
            highlightTo: "highlight_to_id",
            highlightToEntryKey: "1/2/2021",
          },
        ],
      });
    });
  });

  describe("orderedBreadcrumbs", () => {
    it("should show a single daily_journal layer in breadcrumb", () => {
      setup({
        initialUrlLayers: [
          { type: "daily_journal", focusedDate: "01-01-2021" },
        ],
        onValue: (value) => {
          expect(value.orderedBreadcrumbs).toEqual([
            {
              type: "journal_entry",
              journalEntryId: "1/1/2021",
            },
          ]);
        },
      });
    });

    it("should include highlightFrom and highlightTo for layer with both", () => {
      setup({
        initialUrlLayers: [
          {
            type: "daily_journal",
            highlightFrom: "highlight_from_id",
            highlightFromEntryKey: "1/1/2021",
            highlightTo: "highlight_to_id",
            highlightToEntryKey: "1/2/2021",
          },
        ],
        onValue: (value) => {
          expect(value.orderedBreadcrumbs).toEqual([
            {
              type: "journal_entry",
              journalEntryId: "1/1/2021",
            },
            {
              type: "highlight",
              highlightId: "highlight_from_id",
            },
            {
              type: "highlight",
              highlightId: "highlight_to_id",
            },
          ]);
        },
      });
    });
  });
});
