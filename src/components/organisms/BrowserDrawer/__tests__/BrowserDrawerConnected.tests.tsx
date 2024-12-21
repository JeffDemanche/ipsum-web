import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { urlSetBrowserDrawerHighlightsOptions } from "util/api";
import { IpsumDay } from "util/dates";
import { IpsumStateProvider } from "util/state";

import { BrowserDrawerConnected } from "../BrowserDrawerConnected";

jest.mock("util/api/url-actions", () => ({
  ...jest.requireActual("util/api/url-actions"),
  urlSetBrowserDrawerHighlightsOptions: jest.fn(),
}));

describe("BrowserDrawerConnected (Siddhartha)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    IpsumDay.today = jest.fn(() =>
      IpsumDay.fromString("2/12/2020", "entry-printed-date")
    );
  });

  test.skip("empty test", () => {});
});
