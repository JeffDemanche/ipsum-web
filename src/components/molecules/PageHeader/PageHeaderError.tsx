import { Type } from "components/atoms/Type";
import { error300 } from "components/styles";
import React from "react";

import styles from "./PageHeader.less";

export const PageHeaderError: React.FunctionComponent<{ text?: string }> = ({
  text,
}) => {
  return (
    <div
      className={styles["page-header"]}
      style={{ backgroundColor: error300 }}
    >
      <Type weight="light">{text ?? "There was an error"}</Type>
    </div>
  );
};
