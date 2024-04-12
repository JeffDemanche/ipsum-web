import { Chip, Popover } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";
import { IpsumDay } from "util/dates";

interface DayChipProps {
  day: IpsumDay;

  onChange?: (day: IpsumDay) => void;
  onDelete?: () => void;
}

export const DayChip: React.FC<DayChipProps> = ({
  day,
  onChange,
  onDelete,
}) => {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <Popover
        open={pickerOpen}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => setPickerOpen(false)}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {day && (
            <DateCalendar
              disableFuture
              value={dayjs(day.toString("iso"))}
              onChange={(newValue) =>
                onChange(IpsumDay.fromString(newValue.toISOString(), "iso"))
              }
            />
          )}
        </LocalizationProvider>
      </Popover>
      <Chip
        ref={anchorRef}
        variant="outlined"
        label={day?.toString("entry-printed-date") ?? "No date"}
        onClick={() => setPickerOpen(true)}
        onDelete={onDelete}
      />
    </>
  );
};
