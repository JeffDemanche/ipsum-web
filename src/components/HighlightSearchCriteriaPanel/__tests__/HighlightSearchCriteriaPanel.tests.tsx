import { render, screen } from "@testing-library/react";
import React from "react";
import { HighlightSearchCriteriaPanel } from "../HighlightSearchCriteriaPanel";

describe("HighlightSearchCriteriaPanel", () => {
  it("renders empty, inferred criteria results", async () => {
    render(
      <HighlightSearchCriteriaPanel isUserSearch={false} searchCriteria={{}} />
    );

    expect(await screen.findByText("Search criteria")).toBeInTheDocument();
  });
});
