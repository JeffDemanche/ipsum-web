import { render, screen } from "@testing-library/react";
import React from "react";
import { HighlightSearchCriteriaPanel } from "../HighlightSearchCriteriaPanel";
import { useModifySearchParams } from "util/url";
import { IpsumURLSearch } from "util/url/types";

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

  it("renders with plus arrow and text for no search criteria", async () => {
    mockModifySearchHookReturn({});

    render(
      <HighlightSearchCriteriaPanel isUserSearch={false} searchCriteria={{}} />
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
      <HighlightSearchCriteriaPanel isUserSearch={false} searchCriteria={{}} />
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
      <HighlightSearchCriteriaPanel
        isUserSearch={false}
        searchCriteria={{ and: [{ or: [] }] }}
      />
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
      <HighlightSearchCriteriaPanel
        isUserSearch={false}
        searchCriteria={{
          and: [
            { or: [{ days: { days: ["01-01-2021"] } }] },
            { or: [{ days: { days: ["02-02-2021"] } }] },
          ],
        }}
      />
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
