import cx from "classnames";
import { PageHeaderHighlight } from "components/molecules/PageHeader";
import React, { FunctionComponent } from "react";

import styles from "./HighlightPage.less";

interface HighlightPageProps {
  className?: string;

  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;

  highlight: {
    hue: number;
    arcNames: string[];
    highlightNumber: number;
    objectText: string;
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
      Highlight page content
    </div>
  );
};
