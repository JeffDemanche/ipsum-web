import cx from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./PageLayout.less";

interface PageLayoutProps {
  className?: string;
  rows: {
    sections: {
      component: React.ReactNode;
    }[];
  }[];
}

export const PageLayout: FunctionComponent<PageLayoutProps> = ({
  className,
  rows,
}) => {
  return (
    <div className={cx(className, styles["page-layout"])}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles["page-layout-row"]}>
          {row.sections.map((column, columnIndex) => (
            <div key={columnIndex} className={styles["page-layout-section"]}>
              {column.component}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
