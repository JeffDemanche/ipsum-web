import React from "react";
import styles from "./ViewIndex.less";
import { Outlet } from "react-router";

export const ViewIndex: React.FC<{}> = () => {
  return (
    <div className={styles["index-wrapper"]}>
      <div>TODO Index screen</div>
      <Outlet />
    </div>
  );
};
