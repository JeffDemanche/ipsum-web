import React from "react";
import styles from "./ArcDetailSection.less";

interface ArcDetailSectionProps {
  children: React.ReactNode;
}

export const ArcDetailSection: React.FunctionComponent<
  ArcDetailSectionProps
> = ({ children }) => {
  return <section className={styles["arc-detail-section"]}>{children}</section>;
};
