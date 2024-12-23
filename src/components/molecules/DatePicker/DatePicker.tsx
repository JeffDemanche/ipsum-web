import type {
  PickersDayProps} from "@mui/x-date-pickers";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import cx from "classnames";
import { Button } from "components/atoms/Button";
import { TextField } from "components/atoms/TextField";
import {
  font_family_sans,
  font_weight_bold,
  font_weight_light,
} from "components/styles";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type {
  FunctionComponent} from "react";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IpsumArcColor } from "util/colors";
import { IpsumDay } from "util/dates";

import styles from "./DatePicker.less";

export interface DayData {
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
  showManualInput?: boolean;

  onSelect?: (day: IpsumDay, buttonLabel?: string) => void;

  dataOnDay?: (day: IpsumDay) => DayData;
}

interface CalendarContextProps {
  dataOnDay?: (day: IpsumDay) => DayData;
}

const CalendarContext = createContext<CalendarContextProps>({
  dataOnDay: undefined,
});

const DayComponent: FunctionComponent<PickersDayProps<dayjs.Dayjs>> = (
  props
) => {
  const { dataOnDay } = useContext(CalendarContext);

  const day = IpsumDay.fromString((props.day as Dayjs).toISOString(), "iso");

  const loadedData = useRef(false);

  const [data, setData] = useState<DayData | undefined>(undefined);
  useEffect(() => {
    if (dataOnDay && !loadedData.current) {
      loadedData.current = true;
      setData(dataOnDay?.(day));
    }
  }, [data, dataOnDay, day]);

  const PickerDayComponent = data?.entry ? (
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
    data?.arcs?.length > 0 ? (
      <div className={styles["day-with-dots-wrapper"]}>
        {PickerDayComponent}
        <div className={styles["dot-group"]}>
          {data.arcs.slice(0, 6).map(({ hue }, index) => {
            return (
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
            );
          })}
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
  showManualInput,
  onSelect,
  selectedDay,
  dataOnDay,
}) => {
  const [manualEntryValue, setManualEntryValue] = useState<string>("");

  const manualEntryValid = useMemo(() => {
    return IpsumDay.fromString(
      manualEntryValue,
      "entry-printed-date"
    )?.toLuxonDateTime().isValid;
  }, [manualEntryValue]);

  const onManualEntryKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && manualEntryValid) {
      onSelect?.(IpsumDay.fromString(manualEntryValue, "entry-printed-date"));
      e.preventDefault();
    }
  };

  const dayJsSelectedDay = useMemo(() => {
    if (manualEntryValid) {
      return dayjs(
        IpsumDay.fromString(manualEntryValue, "entry-printed-date").toString(
          "url-format"
        )
      );
    }
    return selectedDay ? dayjs(selectedDay.toString("url-format")) : undefined;
  }, [manualEntryValid, manualEntryValue, selectedDay]);

  const buttonOptionsComponent = useMemo(() => {
    return buttonOptions?.map(({ label, day }, index) => (
      <Button
        onClick={() => {
          onSelect?.(day, label);
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
      <div>
        {showManualInput && (
          <TextField
            className={styles["manual-entry-input"]}
            placeholder="M/D/YYYY"
            autoFocus
            onChange={(e) => {
              setManualEntryValue(e.target.value);
            }}
            onKeyDown={onManualEntryKeyDown}
          ></TextField>
        )}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CalendarContext.Provider value={{ dataOnDay }}>
            <DateCalendar
              defaultValue={dayJsSelectedDay}
              showDaysOutsideCurrentMonth
              disableFuture
              onChange={(newValue) => {
                if (newValue) {
                  const day = IpsumDay.fromString(
                    newValue.toISOString(),
                    "iso"
                  );
                  console.log(day);
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
          </CalendarContext.Provider>
        </LocalizationProvider>
      </div>
    </div>
  );
};
