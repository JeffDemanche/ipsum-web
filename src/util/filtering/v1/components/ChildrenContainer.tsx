import React from "react";

import { EndowedNode } from "../types";
import styles from "./ChildrenContainer.less";

interface ChildrenContainerProps {
  node: EndowedNode;
  layout: "block" | "inline";
  children: React.ReactNode;
}

export const ChildrenContainer: React.FC<ChildrenContainerProps> = ({
  node,
  layout,
  children,
}) => {
  return (
    <div
      data-parent-node-type={node.type}
      className={
        layout === "block" ? styles["layout-block"] : styles["layout-inline"]
      }
    >
      {children}
    </div>
  );
};
