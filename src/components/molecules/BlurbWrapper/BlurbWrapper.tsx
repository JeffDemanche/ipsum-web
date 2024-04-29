import { KeyboardArrowRight } from "@mui/icons-material";
import cx from "classnames";
import { Button } from "components/atoms/Button";
import { Type } from "components/atoms/Type";
import React, { CSSProperties, useState } from "react";

import styles from "./BlurbWrapper.less";

interface BlurbWrapperProps {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  maxHeightCollapsed?: CSSProperties["maxHeight"];
  maxHeightExpanded?: CSSProperties["maxHeight"];

  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

export const BlurbWrapper: React.FunctionComponent<BlurbWrapperProps> = ({
  collapsible,
  defaultCollapsed,
  maxHeightCollapsed,
  maxHeightExpanded,
  style,
  className,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const buttonLabel = collapsed ? "Expand" : "Collapse";

  const collapseColumn = collapsible ? (
    <div className={styles["collapse-column"]}>
      <Button
        aria-label={buttonLabel}
        tooltip={buttonLabel}
        className={styles["collapse-button"]}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <KeyboardArrowRight
          className={cx(
            styles["button-icon"],
            !collapsed && styles["expanded"]
          )}
        />
      </Button>
    </div>
  ) : null;

  return (
    <div
      style={{
        maxHeight: collapsed ? maxHeightCollapsed : maxHeightExpanded,
        ...style,
      }}
      className={cx(styles["blurb-wrapper"], className)}
    >
      {collapseColumn}
      <div className={styles["content"]}>
        <Type weight="light">{children}</Type>
      </div>
    </div>
  );
};
