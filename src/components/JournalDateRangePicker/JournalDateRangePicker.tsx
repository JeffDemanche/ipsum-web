import { useQuery } from "@apollo/client";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  // eslint-disable-next-line import/named
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React, { useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { urlToData, useModifySearchParams } from "util/state/url";

export const JournalDateRangeEntryKeysQuery = gql(`
  query JournalDateRangeEntryKeys {
    journalEntryKeys
  }
`);

const EntryKeyContext = React.createContext<Set<string>>(new Set());

const DayComponent: React.FunctionComponent<PickersDayProps<dayjs.Dayjs>> = (
  props
) => {
  const allEntryKeysSet = React.useContext(EntryKeyContext);
  const day = IpsumDay.fromString((props.day as Dayjs).toISOString(), "iso");

  if (allEntryKeysSet.has(day.toString("entry-printed-date"))) {
    return (
      <PickersDay
        style={{ fontWeight: "bold", textDecoration: "underline" }}
        {...props}
      />
    );
  }

  return <PickersDay {...props} />;
};

export const JournalDateRangePicker: React.FunctionComponent = () => {
  const location = useLocation();

  const searchParams = useMemo(
    () => urlToData<"journal">(window.location.href),
    [location]
  );

  const focusedDate = useMemo(() => {
    if (searchParams.layers?.[0]?.type === "daily_journal") {
      return searchParams.layers[0].focusedDate;
    }
    return undefined;
  }, [searchParams.layers]);

  const modifySearchParams = useModifySearchParams<"journal">();

  const setValue = useCallback(
    (newValue: Dayjs) => {
      const day = IpsumDay.fromString(newValue.toISOString(), "iso");
      modifySearchParams((searchParams) => ({
        ...searchParams,
        layers: [
          {
            ...searchParams.layers[0],
            focusedDate: day.toString("url-format"),
          },
          ...searchParams.layers.slice(1),
        ],
      }));
    },
    [modifySearchParams]
  );

  const { data } = useQuery(JournalDateRangeEntryKeysQuery);

  const allEntryKeysSet = useMemo(() => {
    return new Set(data?.journalEntryKeys ?? []);
  }, [data?.journalEntryKeys]);

  return (
    <div>
      <EntryKeyContext.Provider value={allEntryKeysSet}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={dayjs(focusedDate)}
            onChange={(newValue) => setValue(newValue)}
            showDaysOutsideCurrentMonth
            displayWeekNumber
            disableFuture
            slots={{
              day: DayComponent,
            }}
          ></DateCalendar>
        </LocalizationProvider>
      </EntryKeyContext.Provider>
    </div>
  );
};
