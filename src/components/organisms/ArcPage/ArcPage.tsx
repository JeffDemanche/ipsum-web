import cx from "classnames";
import { PageHeaderArc } from "components/molecules/PageHeader";
import { PageLayout } from "components/molecules/PageLayout";
import { hueSwatch } from "components/styles";
import React, { FunctionComponent } from "react";

import styles from "./ArcPage.less";
import { ArcPageSectionAbout } from "./ArcPageSectionAbout";
import { ArcPageSectionRelations } from "./ArcPageSectionRelations";

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
      <div
        className={styles["arc-page-content"]}
        style={{ backgroundColor: hueSwatch(arc.hue, "dark_background") }}
      >
        <PageLayout
          rows={[
            { sections: [{ component: <ArcPageSectionRelations /> }] },
            { sections: [{ component: <ArcPageSectionAbout /> }] },
          ]}
        />
      </div>
    </div>
  );
};
