import React from "react";
import styles from "./ReflectionAccordion.less";
import {
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
  TodayDayReflections,
  PastDayReflections,
} from "components/DayReflections";
import { IpsumDay } from "util/dates";

interface ReflectionAccordionProps {
  isToday: boolean;
  day: IpsumDay;
}

export const ReflectionAccordion: React.FunctionComponent<
  ReflectionAccordionProps
> = ({ isToday, day }) => {
  return (
    <Accordion
      className={styles["reflection-accordion"]}
      defaultExpanded={isToday}
      variant="outlined"
    >
      <AccordionSummary expandIcon={<ExpandMore />} id="panel1a-header">
        <Typography variant="caption">Reflections</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isToday ? (
          <TodayDayReflections day={day} />
        ) : (
          <PastDayReflections day={day} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};
