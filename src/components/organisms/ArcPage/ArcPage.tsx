import { Collapse } from "@mui/material";
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
  onClose?: () => void;

  arc: {
    name: string;
    hue: number;
    relations: React.ComponentProps<
      typeof ArcPageSectionRelations
    >["relations"];
  };

  arcEntry: {
    highlights: React.ComponentProps<typeof ArcPageSectionAbout>["highlights"];
    htmlString: string;
  };
}

export const ArcPage: FunctionComponent<ArcPageProps> = ({
  className,
  expanded,
  onExpand,
  onCollapse,
  onClose,
  arc,
  arcEntry,
}) => {
  return (
    <div className={cx(className, styles["arc-page-wrapper"])}>
      <PageHeaderArc
        arc={arc}
        expanded={expanded}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onClose={onClose}
      />
      <Collapse in={expanded} orientation="vertical">
        <div
          className={styles["arc-page-content"]}
          style={{ backgroundColor: hueSwatch(arc.hue, "dark_background") }}
        >
          <PageLayout
            rows={[
              {
                sections: [
                  {
                    component: (
                      <ArcPageSectionRelations relations={arc.relations} />
                    ),
                  },
                ],
              },
              {
                sections: [
                  {
                    component: (
                      <ArcPageSectionAbout
                        highlights={arcEntry.highlights}
                        htmlString={arcEntry.htmlString}
                      />
                    ),
                  },
                ],
              },
            ]}
          />
        </div>
      </Collapse>
    </div>
  );
};
