import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";

import { LexicalFilterSelector } from "../LexicalFilterSelector";

describe("LexicalFilterSelector", () => {
  const onFilterProgramChangeSpy = jest.fn();
  const arcByIdOrNameSpy = jest.fn();

  const renderFilterSelector = ({ programText }: { programText: string }) => {
    render(
      <LexicalFilterSelector
        editMode
        programText={programText}
        onFilterProgramChange={onFilterProgramChangeSpy}
        arcByIdOrName={arcByIdOrNameSpy}
      />
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("nodes", () => {
    describe("filter type", () => {
      it("should change from highlights to arcs", async () => {
        renderFilterSelector({
          programText: 'highlights from "beginning" to "today"',
        });

        const filterTypeButton = screen.getByText("highlights");

        expect(filterTypeButton).toBeInTheDocument();

        await userEvent.click(filterTypeButton);

        const arcsMenuItem = screen.getByText("arcs");

        await userEvent.click(arcsMenuItem);

        expect(onFilterProgramChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterProgramChangeSpy).toHaveBeenCalledWith(
          "arcs",
          expect.anything()
        );
      });
    });

    describe("filters", () => {
      it("should add a filter expression with none currently enabled when the user clicks the + filter button", async () => {
        renderFilterSelector({
          programText: "highlights",
        });

        const addFilterButton = screen.getByText("+ filter");

        expect(addFilterButton).toBeInTheDocument();

        await userEvent.click(addFilterButton);

        const byDatesMenuItem = screen.getByText("by dates");

        await userEvent.click(byDatesMenuItem);

        expect(onFilterProgramChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterProgramChangeSpy).toHaveBeenCalledWith(
          'highlights from "beginning" to "today"',
          expect.anything()
        );
      });
    });

    describe("sort", () => {
      it("should add a sort expression when the user clicks the + sort button", async () => {
        renderFilterSelector({
          programText: "highlights",
        });

        const addSortButton = screen.getByText("+ sort");

        expect(addSortButton).toBeInTheDocument();

        await userEvent.click(addSortButton);

        expect(onFilterProgramChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterProgramChangeSpy).toHaveBeenCalledWith(
          'highlights sorted by importance as of "today"',
          expect.anything()
        );
      });

      it("should remove the sort expression when the user clicks the - sort button", async () => {
        renderFilterSelector({
          programText: 'highlights sorted by recent as of "today"',
        });

        const removeSortButton = screen.getByText("- sort");

        expect(removeSortButton).toBeInTheDocument();

        await userEvent.click(removeSortButton);

        expect(onFilterProgramChangeSpy).toHaveBeenCalledTimes(1);
        expect(onFilterProgramChangeSpy).toHaveBeenCalledWith(
          "highlights",
          expect.anything()
        );
      });
    });
  });
});
