import { render, screen } from "@testing-library/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { IpsumStateProvider } from "util/state";

import { BrowserDrawerConnected } from "../BrowserDrawerConnected";

describe("BrowserDrawerConnected", () => {
  beforeEach(() => {});

  it("should set url params on date filter from change", () => {
    render(
      <MemoryRouter>
        <IpsumStateProvider projectState={mockSiddhartha().projectState}>
          <BrowserDrawerConnected />
        </IpsumStateProvider>
      </MemoryRouter>
    );

    // const fromPicker = screen.getByLabelText("Highlight filter date from");
  });
});
