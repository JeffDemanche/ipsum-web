import { Collapse } from "@mui/material";
import cx from "classnames";
import { PageHeaderArc } from "components/molecules/PageHeader";
import { PageLayout } from "components/molecules/PageLayout";
import { RelationsTable } from "components/molecules/RelationsTable";
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
    id: string;
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

  relationsTableProps: Pick<
    React.ComponentProps<typeof RelationsTable>,
    | "onCreateRelation"
    | "onDeleteRelation"
    | "arcResults"
    | "onArcSearch"
    | "onArcCreate"
    | "onArcClick"
  >;
}

export const ArcPage: FunctionComponent<ArcPageProps> = ({
  className,
  expanded,
  onExpand,
  onCollapse,
  onClose,
  arc,
  relationsTableProps,
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
                    elevated: true,
                    component: (
                      <ArcPageSectionAbout
                        highlights={arcEntry.highlights}
                        htmlString={arcEntry.htmlString}
                      />
                    ),
                  },
                ],
              },
              {
                sections: [
                  {
                    elevated: true,
                    component: (
                      <ArcPageSectionRelations
                        arcId={arc.id}
                        relations={arc.relations}
                        relationsTableProps={relationsTableProps}
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
