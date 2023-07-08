import React from "react";
import styles from "./ReflectionAccordion.less";
import {
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export const ReflectionAccordion: React.FunctionComponent = () => {
  return (
    <Accordion className={styles["reflection-accordion"]} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMore />} id="panel1a-header">
        <Typography variant="caption">Reflect (0)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>0 reflections</Typography>
      </AccordionDetails>
    </Accordion>
  );
};
