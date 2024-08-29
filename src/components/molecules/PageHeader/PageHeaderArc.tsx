import { hueSwatch } from "components/styles";
import React from "react";

import { ArcTag } from "../ArcTag";
import styles from "./PageHeader.less";
import { PageHeaderNavButtons } from "./PageHeaderNavButtons";

interface PageHeaderArcProps {
  arc: {
    name: string;
    hue: number;
  };

  expanded: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onClose?: () => void;
}

export const PageHeaderArc: React.FunctionComponent<PageHeaderArcProps> = ({
  arc,
  expanded,
  onExpand,
  onCollapse,
  onClose,
}) => {
  return (
    <div
      className={styles["page-header"]}
      style={{ backgroundColor: hueSwatch(arc.hue, "dark_background") }}
    >
      <ArcTag fontSize="medium" hue={arc.hue} text={arc.name} />
      <PageHeaderNavButtons
        showCollapse={expanded}
        showExpand={!expanded}
        showClose
        onClose={onClose}
        onCollapse={onCollapse}
        onExpand={onExpand}
        hue={arc.hue}
      />
    </div>
  );
};
