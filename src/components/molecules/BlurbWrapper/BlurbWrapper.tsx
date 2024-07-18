import { KeyboardArrowRight } from "@mui/icons-material";
import cx from "classnames";
import { Button } from "components/atoms/Button";
import { Type } from "components/atoms/Type";
import React, { CSSProperties, useState } from "react";

import styles from "./BlurbWrapper.less";

interface BlurbWrapperProps {
  collapsible?: boolean;
  maxHeightCollapsed?: CSSProperties["maxHeight"];
  maxHeightExpanded?: CSSProperties["maxHeight"];

  defaultExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;

  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

export const BlurbWrapper: React.FunctionComponent<BlurbWrapperProps> = ({
  collapsible,
  maxHeightCollapsed,
  maxHeightExpanded,
  defaultExpanded,
  onExpand,
  onCollapse,
  style,
  className,
  children,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    const newExpanded = !expanded;
    if (newExpanded) {
      onExpand?.();
    } else {
      onCollapse?.();
    }
    setExpanded(newExpanded);
  };

  const buttonLabel = expanded ? "Collapse" : "Expand";

  const collapseColumn = collapsible ? (
    <div className={styles["collapse-column"]}>
      <Button
        aria-label={buttonLabel}
        tooltip={buttonLabel}
        className={styles["collapse-button"]}
        onClick={() => {
          toggleExpanded();
        }}
      >
        <KeyboardArrowRight
          className={cx(styles["button-icon"], expanded && styles["expanded"])}
        />
      </Button>
    </div>
  ) : null;

  return (
    <div
      style={{
        maxHeight: expanded ? maxHeightExpanded : maxHeightCollapsed,
        ...style,
      }}
      className={cx(styles["blurb-wrapper"], className)}
    >
      {collapseColumn}
      <div className={styles["content"]}>{children}</div>
    </div>
  );
};
