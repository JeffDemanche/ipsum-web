import cx from "classnames";
import React from "react";

import type { EndowedNode } from "../types";
import styles from "./ChildrenContainer.less";

interface ChildrenContainerProps {
  node: EndowedNode;
  layout: "block" | "inline";
  highlight?: boolean;
  indentChildren?: boolean;
  children: React.ReactNode;
}

export const ChildrenContainer: React.FC<ChildrenContainerProps> = ({
  node,
  layout,
  highlight,
  indentChildren,
  children,
}) => {
  return (
    <div
      data-parent-node-type={node.type}
      className={cx(
        styles["children-container"],
        layout === "block" ? styles["layout-block"] : styles["layout-inline"],
        highlight && styles["highlighted"],
        indentChildren && styles["indent-children"]
      )}
    >
      {children}
    </div>
  );
};
