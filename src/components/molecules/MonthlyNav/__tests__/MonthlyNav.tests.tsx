import { render, screen } from "@testing-library/react";
import React from "react";
import { IpsumDay } from "util/dates";

import { MonthlyNav } from "..";

describe("molecules/MonthlyNav", () => {
  const mockOnDaySelect = jest.fn();
  const mockOnMonthChange = jest.fn();

  const defaultProps = (
    overrides: Partial<React.ComponentProps<typeof MonthlyNav>> = {}
  ): React.ComponentProps<typeof MonthlyNav> => {
    return {
      entryDays: [
        new IpsumDay(30, 11, 2023),
        new IpsumDay(31, 11, 2023),
        new IpsumDay(1, 0, 2024),
        new IpsumDay(5, 0, 2024),
        new IpsumDay(10, 0, 2024),
        new IpsumDay(4, 1, 2024),
        new IpsumDay(18, 1, 2024),
      ],
      selectedDay: new IpsumDay(10, 0, 2024),
      today: new IpsumDay(1, 0, 2024),
      onDaySelect: mockOnDaySelect,
      onMonthChange: mockOnMonthChange,
      ...overrides,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fires onDaySelect when a day is clicked", () => {
    render(<MonthlyNav {...defaultProps()} />);

    const day = screen.getByText("5");
    day.click();

    expect(mockOnDaySelect).toHaveBeenCalledWith(new IpsumDay(5, 0, 2024));
  });
});
