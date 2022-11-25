import React from "react";
import styles from "./ViewIndex.less";
import { Outlet } from "react-router";
import { Box } from "@mui/material";

export const ViewIndex: React.FC = () => {
  return (
    <Box
      sx={{ backgroundColor: "background.default" }}
      className={styles["index-wrapper"]}
    >
      <div>TODO Index screen</div>
      <Outlet />
    </Box>
  );
};
