import { Collapse } from "@mui/material";
import cx from "classnames";
import { PageHeaderHighlight } from "components/molecules/PageHeader";
import { PageLayout } from "components/molecules/PageLayout";
import { hueSwatch } from "components/styles";
import React, { FunctionComponent } from "react";
import { IpsumDay } from "util/dates";

import styles from "./HighlightPage.less";
import { HighlightPageSectionAttributes } from "./HighlightPageSectionAttributes";
import { HighlightPageSectionComments } from "./HighlightPageSectionComments";
import { HighlightPageSectionExcerpt } from "./HighlightPageSectionExcerpt";

interface HighlightPageProps {
  className?: string;

  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onClose?: () => void;

  onAttributesSectionCreateRelation: React.ComponentProps<
    typeof HighlightPageSectionAttributes
  >["onCreateRelation"];
  onAttributesSectionDeleteRelation: React.ComponentProps<
    typeof HighlightPageSectionAttributes
  >["onDeleteRelation"];
  onAttributesSectionArcSearch: React.ComponentProps<
    typeof HighlightPageSectionAttributes
  >["onArcSearch"];
  attributesSectionArcResults: React.ComponentProps<
    typeof HighlightPageSectionAttributes
  >["arcResults"];

  highlight: {
    id: string;
    htmlString: string;
    hue: number;
    arcNames: string[];
    highlightNumber: number;
    objectText: string;
    relations: React.ComponentProps<
      typeof HighlightPageSectionAttributes
    >["relations"];

    comments: React.ComponentProps<
      typeof HighlightPageSectionComments
    >["comments"];
  };

  today: IpsumDay;
}

export const HighlightPage: FunctionComponent<HighlightPageProps> = ({
  className,
  highlight,
  expanded,
  onExpand,
  onCollapse,
  onClose,
  onAttributesSectionCreateRelation,
  onAttributesSectionDeleteRelation,
  onAttributesSectionArcSearch,
  attributesSectionArcResults,
  today,
}) => {
  return (
    <div className={cx(className, styles["highlight-page-wrapper"])}>
      <PageHeaderHighlight
        highlight={{
          hue: highlight.hue,
          arcNames: highlight.arcNames,
          highlightNumber: highlight.highlightNumber,
          objectText: highlight.objectText,
        }}
        expanded={expanded}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onClose={onClose}
      />
      <Collapse in={expanded} orientation="vertical">
        <div
          className={styles["highlight-page-content"]}
          style={{
            backgroundColor: hueSwatch(highlight.hue, "light_background"),
          }}
        >
          <PageLayout
            rows={[
              {
                sections: [
                  {
                    elevated: true,
                    component: (
                      <HighlightPageSectionExcerpt
                        highlightId={highlight.id}
                        highlightHue={highlight.hue}
                        htmlString={highlight.htmlString}
                      />
                    ),
                  },
                ],
              },
              {
                sections: [
                  {
                    elevated: false,
                    component: (
                      <HighlightPageSectionAttributes
                        relations={highlight.relations}
                        onCreateRelation={onAttributesSectionCreateRelation}
                        onDeleteRelation={onAttributesSectionDeleteRelation}
                        arcResults={attributesSectionArcResults}
                        onArcSearch={onAttributesSectionArcSearch}
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
                      <HighlightPageSectionComments
                        today={today}
                        comments={highlight.comments}
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
