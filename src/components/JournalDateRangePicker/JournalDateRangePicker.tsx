import React, { useCallback, useState } from "react";
import { DateRange, Range } from "react-date-range";
import { addDays } from "date-fns";
import styles from "./JournalDateRangePicker.less";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { IpsumDateTime } from "util/dates";
import { theme } from "styles/styles";

export const JournalDateRangeQuery = gql(`
  query JournalDateRange($entryKeys: [ID!]!) {
    entries(entryKeys: $entryKeys) {
      entryKey
    }
  }
`);

export const JournalDateRangePicker: React.FunctionComponent = () => {
  const [state, setState] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const today = new Date();

  const dateToMonthEntryKeys = useCallback((item: Date) => {
    const monthStartDay = IpsumDateTime.fromJsDate(item).dateTime;
    const monthEndDay = IpsumDateTime.fromJsDate(item).dateTime.endOf("month");

    const monthEntryKeys: string[] = [];
    let dayCounter = monthStartDay.day;
    while (dayCounter <= monthEndDay.day) {
      const day = IpsumDateTime.fromJsDate(
        monthStartDay.set({ day: dayCounter }).toJSDate()
      );
      monthEntryKeys.push(day.toString("entry-printed-date"));
      dayCounter++;
    }
    return monthEntryKeys;
  }, []);

  const [monthEntryKeys, setMonthEntryKeys] = useState<string[]>(
    dateToMonthEntryKeys(
      IpsumDateTime.fromJsDate(today).dateTime.startOf("month").toJSDate()
    )
  );

  const { data } = useQuery(JournalDateRangeQuery, {
    variables: { entryKeys: monthEntryKeys },
  });

  const dayContentRenderer = useCallback(
    (day: Date) => {
      if (
        data.entries
          .map((entry) => entry.entryKey)
          .includes(
            IpsumDateTime.fromJsDate(day).toString("entry-printed-date")
          )
      ) {
        // Days with entries
        return <div style={{ fontWeight: "700" }}>{day.getDate()}</div>;
      } else {
        return (
          <div style={{ color: theme.palette.onSurfaceDisabled }}>
            {day.getDate()}
          </div>
        );
      }
    },
    [data.entries]
  );

  return (
    <DateRange
      date={today}
      className={styles["picker"]}
      onChange={(item) => {
        setState([item.selection]);
      }}
      onShownDateChange={(item) => {
        setMonthEntryKeys(dateToMonthEntryKeys(item));
      }}
      moveRangeOnFirstSelection={false}
      dayContentRenderer={dayContentRenderer}
      ranges={state}
      direction="vertical"
      preventSnapRefocus={true}
      calendarFocus="backwards"
      color="black"
      rangeColors={["#D0D0D0"]}
    ></DateRange>
  );
};
