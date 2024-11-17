import cx from "classnames";
import React from "react";

import { EndowedNode } from "../types";
import styles from "./ChildrenContainer.less";

interface ChildrenContainerProps {
  node: EndowedNode;
  layout: "block" | "inline";
  highlight?: boolean;
  children: React.ReactNode;
}

export const ChildrenContainer: React.FC<ChildrenContainerProps> = ({
  node,
  layout,
  highlight,
  children,
}) => {
  return (
    <div
      data-parent-node-type={node.type}
      className={cx(
        layout === "block" ? styles["layout-block"] : styles["layout-inline"],
        highlight && styles["highlighted"]
      )}
    >
      {children}
    </div>
  );
};
