import type { FunctionComponent } from "react";
import React from "react";

import { HighlightTag } from "../HighlightTag";
import styles from "./PageHeader.less";
import { PageHeaderNavButtons } from "./PageHeaderNavButtons";

interface PageHeaderHighlightProps {
  highlight: {
    hue: number;
    arcNames: string[];
    objectText: string;
    highlightNumber: number;
  };

  expanded: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onClose?: () => void;
}

export const PageHeaderHighlight: FunctionComponent<
  PageHeaderHighlightProps
> = ({ highlight, expanded, onCollapse, onExpand, onClose }) => {
  return (
    <div
      className={styles["page-header"]}
      style={{
        backgroundColor: `hsla(${highlight.hue ?? 0}, ${highlight.hue === null ? "0%" : "80%"}, 95%, 1)`,
      }}
    >
      <HighlightTag
        hue={highlight.hue}
        arcNames={highlight.arcNames}
        objectText={highlight.objectText}
        highlightNumber={highlight.highlightNumber}
      />
      <PageHeaderNavButtons
        showCollapse={expanded}
        showExpand={!expanded}
        showClose
        onClose={onClose}
        onCollapse={onCollapse}
        onExpand={onExpand}
        hue={highlight.hue}
        onLightBackground
      />
    </div>
  );
};
