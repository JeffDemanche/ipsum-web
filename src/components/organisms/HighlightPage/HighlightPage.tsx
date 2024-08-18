import cx from "classnames";
import { PageHeaderHighlight } from "components/molecules/PageHeader";
import { PageLayout } from "components/molecules/PageLayout";
import { hueSwatch } from "components/styles";
import React, { FunctionComponent } from "react";

import styles from "./HighlightPage.less";
import { HighlightPageSectionAttributes } from "./HighlightPageSectionAttributes";
import { HighlightPageSectionComments } from "./HighlightPageSectionComments";
import { HighlightPageSectionExcerpt } from "./HighlightPageSectionExcerpt";

interface HighlightPageProps {
  className?: string;

  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;

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
  };
}

export const HighlightPage: FunctionComponent<HighlightPageProps> = ({
  className,
  highlight,
  expanded,
  onExpand,
  onCollapse,
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
      />
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
                  component: (
                    <HighlightPageSectionExcerpt
                      highlightId={highlight.id}
                      highlightHue={highlight.hue}
                      htmlString={highlight.htmlString}
                    />
                  ),
                },
                {
                  component: (
                    <HighlightPageSectionAttributes
                      relations={highlight.relations}
                    />
                  ),
                },
              ],
            },
            {
              sections: [{ component: <HighlightPageSectionComments /> }],
            },
          ]}
        />
      </div>
    </div>
  );
};
