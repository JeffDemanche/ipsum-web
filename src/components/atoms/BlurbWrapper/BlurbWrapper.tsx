import React from "react";

import styles from "./BlurbWrapper.less";

interface BlurbWrapperProps {
  children: React.ReactNode;
}

export const BlurbWrapper: React.FunctionComponent<BlurbWrapperProps> = ({
  children,
}) => {
  return <div className={styles["blurb-wrapper"]}>{children}</div>;
};
