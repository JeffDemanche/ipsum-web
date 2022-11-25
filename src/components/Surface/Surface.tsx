import { Paper } from "@mui/material";
import React from "react";
import styles from "./Surface.less";
import { SurfaceEditor } from "./SurfaceEditor";

export const Surface = () => {
  return (
    <Paper className={styles["surface"]}>
      <SurfaceEditor />
    </Paper>
  );
};
