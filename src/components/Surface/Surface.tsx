import React from "react";
import styles from "./Surface.less";
import { SurfaceEditor } from "./SurfaceEditor";

export const Surface: React.FC<{}> = () => {
  return (
    <div className={styles["surface"]}>
      <SurfaceEditor />
    </div>
  );
};
