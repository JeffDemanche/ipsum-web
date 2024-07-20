import { ApolloProvider } from "@apollo/client";
import { fireEvent } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import { IpsumDay } from "util/dates";
import { useModifySearchParams } from "util/state/url";
import { IpsumURLSearch } from "util/state/url/types";

import { HighlightSearchCriteriaPanel } from "../HighlightSearchCriteriaPanel";

jest.mock("util/url");

describe("HighlightSearchCriteriaPanel", () => {
  let modifySearchHookReturnMock: jest.Mock;

  const mockModifySearchHookReturn = (
    existingPrams: IpsumURLSearch<"journal">
  ) => {
    modifySearchHookReturnMock = jest.fn(
      (
        callback: (
          existingParams: IpsumURLSearch<"journal">
        ) => IpsumURLSearch<"journal">
      ) => {
        return callback(existingPrams);
      }
    );
    jest
      .mocked(useModifySearchParams)
      .mockReturnValue(modifySearchHookReturnMock);
  };

  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("and clauses", () => {
    it("renders with plus arrow and text for no search criteria", async () => {
      mockModifySearchHookReturn({});

      render(
        <ApolloProvider client={client}>
          <HighlightSearchCriteriaPanel
            isUserSearch={false}
            searchCriteria={{}}
          />
        </ApolloProvider>
      );

      expect(
        await screen.findByTestId("add-and-clause-button")
      ).toBeInTheDocument();
      expect(
        await screen.findByText("Filter highlights by adding criteria")
      ).toBeInTheDocument();
      expect(modifySearchHookReturnMock).not.toHaveBeenCalled();
    });

    it("adding an and clause changes the url search params", async () => {
      mockModifySearchHookReturn({ layers: [] });

      render(
        <ApolloProvider client={client}>
          <HighlightSearchCriteriaPanel
            isUserSearch={false}
            searchCriteria={{}}
          />
        </ApolloProvider>
      );

      const addAndClauseButton = await screen.findByTestId(
        "add-and-clause-button"
      );
      addAndClauseButton.click();

      expect(modifySearchHookReturnMock).toHaveBeenCalledTimes(1);
      expect(modifySearchHookReturnMock).toHaveReturnedWith({
        layers: [],
        searchCriteria: { and: [{ or: [] }] },
      });
    });

    it("adding a second and clause changes the url search params", async () => {
      mockModifySearchHookReturn({
        layers: [],
        searchCriteria: { and: [{ or: [] }] },
      });

      render(
        <ApolloProvider client={client}>
          <HighlightSearchCriteriaPanel
            isUserSearch={false}
            searchCriteria={{ and: [{ or: [] }] }}
          />
        </ApolloProvider>
      );

      const addAndClauseButton = await screen.findByTestId(
        "add-and-clause-button"
      );
      addAndClauseButton.click();

      expect(modifySearchHookReturnMock).toHaveBeenCalledTimes(1);
      expect(modifySearchHookReturnMock).toHaveReturnedWith({
        layers: [],
        searchCriteria: { and: [{ or: [] }, { or: [] }] },
      });
    });

    it("removing an and clause changes the url search params", async () => {
      mockModifySearchHookReturn({
        layers: [],
        searchCriteria: {
          and: [
            { or: [{ days: { days: ["01-01-2021"] } }] },
            { or: [{ days: { days: ["02-02-2021"] } }] },
          ],
        },
      });

      render(
        <ApolloProvider client={client}>
          <HighlightSearchCriteriaPanel
            isUserSearch={false}
            searchCriteria={{
              and: [
                { or: [{ days: { days: ["01-01-2021"] } }] },
                { or: [{ days: { days: ["02-02-2021"] } }] },
              ],
            }}
          />
        </ApolloProvider>
      );

      const removeAndClauseButton = (
        await screen.findAllByTestId("remove-and-clause-button")
      )[0];
      removeAndClauseButton.click();

      expect(modifySearchHookReturnMock).toHaveBeenCalledTimes(1);
      expect(modifySearchHookReturnMock).toHaveReturnedWith({
        layers: [],
        searchCriteria: { and: [{ or: [{ days: { days: ["02-02-2021"] } }] }] },
      });
    });
  });

  describe("or clauses", () => {
    it("adding a day or clause changes the url search params", async () => {
      mockModifySearchHookReturn({
        layers: [],
        searchCriteria: { and: [{ or: [] }] },
      });

      render(
        <ApolloProvider client={client}>
          <HighlightSearchCriteriaPanel
            isUserSearch={false}
            searchCriteria={{ and: [{ or: [] }] }}
          />
        </ApolloProvider>
      );

      const addOrClauseButton = await screen.findByTestId(
        "add-or-clause-date-button"
      );
      addOrClauseButton.click();

      expect(modifySearchHookReturnMock).toHaveBeenCalledTimes(1);
      expect(modifySearchHookReturnMock).toHaveReturnedWith({
        layers: [],
        searchCriteria: {
          and: [
            {
              or: [
                { days: { days: [IpsumDay.today().toString("url-format")] } },
              ],
            },
          ],
        },
      });
    });

    // RTL/MUI being annoying with the date popover.
    it.todo("editing a day or clause changes the url search params");

    it("removing a day or clause changes the url search params", async () => {
      mockModifySearchHookReturn({
        layers: [],
        searchCriteria: { and: [{ or: [{ days: { days: ["01-01-2024"] } }] }] },
      });

      render(
        <ApolloProvider client={client}>
          <HighlightSearchCriteriaPanel
            isUserSearch={false}
            searchCriteria={{
              and: [{ or: [{ days: { days: ["01-01-2024"] } }] }],
            }}
          />
        </ApolloProvider>
      );

      const removeOrClauseButton = (
        await screen.findAllByTestId("CancelIcon")
      )[0];
      fireEvent.click(removeOrClauseButton);

      expect(modifySearchHookReturnMock).toHaveBeenCalledTimes(1);
      expect(modifySearchHookReturnMock).toHaveReturnedWith({
        layers: [],
        searchCriteria: { and: [{ or: [] }] },
      });
    });

    it("removing an arc or clause changes the url search params", async () => {
      const criteria = {
        and: [
          {
            or: [
              {
                relatesToArc: {
                  arcId: "arc-1",
                },
              },
            ],
          },
        ],
      };

      mockModifySearchHookReturn({
        layers: [],
        searchCriteria: criteria,
      });

      render(
        <ApolloProvider client={client}>
          <HighlightSearchCriteriaPanel
            isUserSearch={false}
            searchCriteria={criteria}
          />
        </ApolloProvider>
      );

      const removeOrClauseButton = (
        await screen.findAllByTestId("CancelIcon")
      )[0];
      fireEvent.click(removeOrClauseButton);

      expect(modifySearchHookReturnMock).toHaveBeenCalledTimes(1);
      expect(modifySearchHookReturnMock).toHaveReturnedWith({
        layers: [],
        searchCriteria: { and: [{ or: [] }] },
      });
    });
  });
});
