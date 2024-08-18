import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { urlSetBrowserDrawerHighlightsOptions } from "util/api";
import { IpsumDay } from "util/dates";
import { IpsumStateProvider } from "util/state";

import { BrowserDrawerConnected } from "../BrowserDrawerConnected";

jest.mock("util/api", () => ({
  ...jest.requireActual("util/api"),
  urlSetBrowserDrawerHighlightsOptions: jest.fn(),
}));

describe("BrowserDrawerConnected (Siddhartha)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    IpsumDay.today = jest.fn(() =>
      IpsumDay.fromString("2/12/2020", "entry-printed-date")
    );
  });

  it("should set url params on date filter from change", async () => {
    render(
      <MemoryRouter>
        <IpsumStateProvider projectState={mockSiddhartha().projectState}>
          <BrowserDrawerConnected />
        </IpsumStateProvider>
      </MemoryRouter>
    );

    const fromPicker = screen.getAllByLabelText(
      "Highlight filter date from"
    )[0];

    await act(async () => {
      await userEvent.click(fromPicker);
    });

    const firstDay = screen.getAllByRole("gridcell", { name: "1" })[0];

    await act(async () => {
      await userEvent.click(firstDay);
    });

    expect(urlSetBrowserDrawerHighlightsOptions).toHaveBeenCalledWith(
      {
        filters: { dateFrom: "01-01-2020" },
      },
      expect.any(Object)
    );
  });
});
