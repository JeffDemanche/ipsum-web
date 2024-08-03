import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import cx from "classnames";
import { Button } from "components/atoms/Button";
import {
  font_family_sans,
  font_weight_bold,
  font_weight_light,
} from "components/styles";
import dayjs, { Dayjs } from "dayjs";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useMemo,
} from "react";
import { IpsumArcColor } from "util/colors";
import { IpsumDay } from "util/dates";

import styles from "./DatePicker.less";

interface DayData {
  entry: boolean;
  arcs: {
    name: string;
    hue: number;
  }[];
}

interface ButtonOption {
  label: string;
  day: IpsumDay;
}

interface DatePickerProps {
  className?: string;
  selectedDay?: IpsumDay;
  showButtonOptions?: boolean;
  buttonOptions?: ButtonOption[];

  onSelect?: (day: IpsumDay) => void;

  dataOnDay?: (day: IpsumDay) => DayData;
}

interface CalendarContextProps {
  dataOnDay?: (day: IpsumDay) => DayData;
}

const CalendarContext = createContext<CalendarContextProps>({
  dataOnDay: () => undefined,
});

const DayComponent: FunctionComponent<PickersDayProps<dayjs.Dayjs>> = (
  props
) => {
  const { dataOnDay } = useContext(CalendarContext);
  const day = IpsumDay.fromString((props.day as Dayjs).toISOString(), "iso");

  const PickerDayComponent = dataOnDay?.(day)?.entry ? (
    <PickersDay
      className={styles["day"]}
      style={{
        fontWeight: font_weight_bold,
      }}
      {...props}
    />
  ) : (
    <PickersDay style={{ fontWeight: font_weight_light }} {...props} />
  );

  const DayComponentWithDots =
    dataOnDay?.(day)?.arcs.length > 0 ? (
      <div className={styles["day-with-dots-wrapper"]}>
        {PickerDayComponent}
        <div className={styles["dot-group"]}>
          {dataOnDay?.(day)?.arcs.map(({ hue }, index) => (
            <span
              key={index}
              className="dot"
              style={{
                color: new IpsumArcColor(hue)
                  .toIpsumColor({
                    saturation: 50,
                    lightness: 50,
                  })
                  .toRgbaCSS(),
              }}
            >
              .
            </span>
          ))}
        </div>
      </div>
    ) : (
      PickerDayComponent
    );

  return DayComponentWithDots;
};

export const DatePicker: FunctionComponent<DatePickerProps> = ({
  className,
  showButtonOptions,
  buttonOptions,
  onSelect,
  selectedDay,
  dataOnDay,
}) => {
  const dayJsSelectedDay = useMemo(
    () => (selectedDay ? dayjs(selectedDay.toString("url-format")) : undefined),
    [selectedDay]
  );

  const buttonOptionsComponent = useMemo(() => {
    return buttonOptions?.map(({ label, day }, index) => (
      <Button
        onClick={() => {
          onSelect?.(day);
        }}
        key={index}
      >
        {label}
      </Button>
    ));
  }, [buttonOptions, onSelect]);

  return (
    <div className={cx(className, styles["date-picker-wrapper"])}>
      {showButtonOptions && (
        <div className={styles["button-options"]}>{buttonOptionsComponent}</div>
      )}
      <CalendarContext.Provider value={{ dataOnDay }}>
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
            className={styles["calendar"]}
            slots={{
              day: DayComponent,
            }}
            slotProps={{
              calendarHeader: { sx: { fontFamily: font_family_sans } },
            }}
          />
        </LocalizationProvider>
      </CalendarContext.Provider>
    </div>
  );
};
