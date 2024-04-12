import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router";

import styles from "./ViewIndex.less";

export const ViewIndex: React.FC = () => {
  return (
    <Box sx={{}} className={styles["index-wrapper"]}>
      <Outlet />
    </Box>
  );
};
