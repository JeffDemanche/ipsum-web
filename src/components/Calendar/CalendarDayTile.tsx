import React, { useContext } from "react";
import cx from "classnames";
import { Link, useSearchParams } from "react-router-dom";
import { IpsumDateTime } from "util/dates";
import { VisibleEntriesContext } from "views/VisibleEntriesContext";
import styles from "./CalendarDayTile.less";
import { Card, Container, Paper, Typography } from "@mui/material";

interface CalendarDayTileProps {
  date: IpsumDateTime;
  entryDate?: IpsumDateTime;
}

export const CalendarDayTile: React.FC<CalendarDayTileProps> = ({
  date,
  entryDate,
}: CalendarDayTileProps) => {
  const { visibleDateRangeStart, visibleDateRangeEnd } = useContext(
    VisibleEntriesContext
  );

  const isInRange = date.isInRange(visibleDateRangeStart, visibleDateRangeEnd);

  const [searchParams] = useSearchParams();

  const dayNumber = date.dateTime.day;

  const linkSearchParams = new URLSearchParams(searchParams);
  if (entryDate) {
    linkSearchParams.set("startDate", entryDate.toString("url-format"));
    linkSearchParams.set("endDate", entryDate.toString("url-format"));
  }

  return entryDate ? (
    isInRange ? (
      <Paper variant="elevation">
        <Typography
          textAlign={"center"}
          variant="caption"
          className={cx(styles["tile"], {
            [styles["in-selected-range"]]: isInRange,
          })}
        >
          <p>
            <Link
              to={{
                search: linkSearchParams.toString(),
              }}
            >
              {dayNumber}
            </Link>
          </p>
        </Typography>
      </Paper>
    ) : (
      <Typography
        textAlign={"center"}
        variant="caption"
        className={cx(styles["tile"], {
          [styles["in-selected-range"]]: isInRange,
        })}
      >
        <p>
          <Link
            to={{
              search: linkSearchParams.toString(),
            }}
          >
            {dayNumber}
          </Link>
        </p>
      </Typography>
    )
  ) : isInRange ? (
    <Paper variant="elevation">
      <Typography
        variant="caption"
        tabIndex={0}
        className={cx(styles["tile"], {
          [styles["in-selected-range"]]: isInRange,
        })}
      >
        <p>{dayNumber}</p>
      </Typography>
    </Paper>
  ) : (
    <Typography
      variant="caption"
      tabIndex={0}
      className={cx(styles["tile"], {
        [styles["in-selected-range"]]: isInRange,
      })}
    >
      <p>{dayNumber}</p>
    </Typography>
  );
};
