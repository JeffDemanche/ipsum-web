import cx from "classnames";
import { PageHeaderArc } from "components/molecules/PageHeader";
import React, { FunctionComponent } from "react";

import styles from "./ArcPage.less";

interface ArcPageProps {
  className?: string;

  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;

  arc: {
    name: string;
    hue: number;
  };
}

export const ArcPage: FunctionComponent<ArcPageProps> = ({
  className,
  expanded,
  onExpand,
  onCollapse,
  arc,
}) => {
  return (
    <div className={cx(className, styles["arc-page-wrapper"])}>
      <PageHeaderArc
        arc={arc}
        expanded={expanded}
        onExpand={onExpand}
        onCollapse={onCollapse}
      />
      <div>Arc page content</div>
    </div>
  );
};
