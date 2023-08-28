import React from "react";
import styles from "./ReflectionAccordion.less";
import {
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { DayReflections } from "components/DayReflections";
import { IpsumDay } from "util/dates";

interface ReflectionAccordionProps {
  day: IpsumDay;
}

export const ReflectionAccordion: React.FunctionComponent<
  ReflectionAccordionProps
> = ({ day }) => {
  return (
    <Accordion className={styles["reflection-accordion"]} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMore />} id="panel1a-header">
        <Typography variant="caption">Reflect (0)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <DayReflections day={day} />
      </AccordionDetails>
    </Accordion>
  );
};
