import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { font_family_sans } from "components/styles";
import dayjs, { Dayjs } from "dayjs";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useMemo,
} from "react";
import { IpsumDay } from "util/dates";

interface DatePickerProps {
  selectedDay?: IpsumDay;

  onSelect?: (day: IpsumDay) => void;

  entryOnDay?: (day: IpsumDay) => boolean;
}

interface CalendarContextProps {
  entryOnDay?: (day: IpsumDay) => boolean;
}

const CalendarContext = createContext<CalendarContextProps>({
  entryOnDay: () => false,
});

const DayComponent: FunctionComponent<PickersDayProps<dayjs.Dayjs>> = (
  props
) => {
  const { entryOnDay } = useContext(CalendarContext);
  const day = IpsumDay.fromString((props.day as Dayjs).toISOString(), "iso");

  if (entryOnDay(day)) {
    return (
      <PickersDay
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
        }}
        {...props}
      />
    );
  }

  return <PickersDay {...props} />;
};

export const DatePicker: FunctionComponent<DatePickerProps> = ({
  entryOnDay,
  onSelect,
  selectedDay,
}) => {
  const dayJsSelectedDay = useMemo(
    () => (selectedDay ? dayjs(selectedDay.toString("url-format")) : undefined),
    [selectedDay]
  );

  return (
    <CalendarContext.Provider value={{ entryOnDay }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={dayJsSelectedDay}
          showDaysOutsideCurrentMonth
          disableFuture
          onChange={(newValue) => {
            if (newValue) {
              const day = IpsumDay.fromString(newValue.toISOString(), "iso");
              onSelect?.(day);
            }
          }}
          slots={{
            day: DayComponent,
          }}
          slotProps={{
            calendarHeader: { sx: { fontFamily: font_family_sans } },
          }}
        />
      </LocalizationProvider>
    </CalendarContext.Provider>
  );
};
