import { render, screen } from "@testing-library/react";
import { DateTime } from "luxon";
import React from "react";
import { IpsumDateTime, useDate } from "util/dates";
import { Calendar } from "../Calendar";
import { useSearchParams } from "react-router-dom";

jest.mock("react-router-dom");
jest.mock("../Calendar.less", () => jest.fn());
jest.mock("util/dates", () => ({
  ...jest.requireActual("util/dates"),
  useDate: jest.fn(),
}));

describe("Calendar", () => {
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue([
      {
        get: () => {},
      },
    ]);
    (useDate as jest.Mock).mockImplementation(
      () =>
        new IpsumDateTime(
          DateTime.fromObject({
            month: 1,
            year: 3000,
          })
        )
    );
  });

  it("renders days of week starting on sunday", async () => {
    const { unmount } = render(<Calendar />);

    const daysOfWeek = screen.getAllByTestId("calendar-day-of-week", {
      exact: false,
    });

    expect(daysOfWeek[0]).toHaveTextContent("sun");
    expect(daysOfWeek[1]).toHaveTextContent("mon");
    expect(daysOfWeek[2]).toHaveTextContent("tue");
    expect(daysOfWeek[3]).toHaveTextContent("wed");
    expect(daysOfWeek[4]).toHaveTextContent("thu");
    expect(daysOfWeek[5]).toHaveTextContent("fri");
    expect(daysOfWeek[6]).toHaveTextContent("sat");

    unmount();
  });

  it.each`
    month | year    | expectedEmptyDays
    ${1}  | ${2022} | ${6}
    ${5}  | ${2022} | ${0}
    ${8}  | ${2023} | ${2}
    ${8}  | ${1998} | ${6}
    ${10} | ${2035} | ${1}
  `(
    "should render the correct starting day month: $month, year: $year",
    ({ month, year, expectedEmptyDays }) => {
      (useDate as jest.Mock).mockImplementation(
        () =>
          new IpsumDateTime(
            DateTime.fromObject({
              month,
              year,
            })
          )
      );

      const { unmount } = render(<Calendar />);

      if (expectedEmptyDays === 0) {
        expect(screen.queryByTestId("calendar-empty-day")).toBeNull();
      } else {
        expect(screen.getAllByTestId("calendar-empty-day")).toHaveLength(
          expectedEmptyDays
        );
      }

      unmount();
    }
  );

  it("renders 3 empty days at the start of the month for june 2022", async () => {
    (useDate as jest.Mock).mockReturnValue(
      new IpsumDateTime(DateTime.fromObject({ month: 6, year: 2022 }))
    );
    const { unmount } = render(<Calendar />);

    const emptyDays = screen.getAllByTestId("calendar-empty-day");
    expect(emptyDays).toHaveLength(3);

    unmount();
  });

  it("renders 28 days in february", async () => {
    (useDate as jest.Mock).mockReturnValue(
      new IpsumDateTime(DateTime.fromObject({ month: 2, year: 3000 }))
    );
    const { unmount } = render(<Calendar />);

    expect(await screen.findByText("28")).toBeDefined();

    unmount();
  });
});
