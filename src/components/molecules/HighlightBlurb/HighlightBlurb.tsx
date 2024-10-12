import cx from "classnames";
import { Button } from "components/atoms/Button";
import { BlurbExcerpt } from "components/molecules/BlurbExcerpt";
import { BlurbWrapper } from "components/molecules/BlurbWrapper";
import { HighlightTag } from "components/molecules/HighlightTag";
import { RelationsTable } from "components/molecules/RelationsTable";
import React, { useState } from "react";

import styles from "./HighlightBlurb.less";

interface HighlightBlurbProps {
  className?: string;
  style?: React.CSSProperties;

  highlightProps: {
    highlightId: string;
    objectText: string;
    hue: number;
    highlightNumber: number;
    arcNames: string[];
    importanceRating: number;
  };
  excerptProps: { htmlString: string; maxLines?: number };
  relations: React.ComponentProps<typeof RelationsTable>["relations"];

  selected?: boolean;
  onSelect?: () => void;

  defaultExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;

  onHighlightClick?: () => void;
  onHighlightObjectClick?: () => void;
}

export const HighlightBlurb: React.FunctionComponent<HighlightBlurbProps> = ({
  className,
  highlightProps,
  excerptProps,
  relations,
  selected,
  onSelect,
  defaultExpanded,
  onExpand,
  onCollapse,
  onHighlightClick,
  onHighlightObjectClick,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const onBlurbWrapperExpand = () => {
    setExpanded(true);
    onExpand?.();
  };

  const onBlurbWrapperCollapse = () => {
    setExpanded(false);
    onCollapse?.();
  };

  return (
    <BlurbWrapper
      className={cx(
        className,
        styles["highlight-blurb-wrapper"],
        expanded && styles["expanded"]
      )}
      collapsible
      onExpand={onBlurbWrapperExpand}
      onCollapse={onBlurbWrapperCollapse}
    >
      <div className={styles["blurb-content"]}>
        <HighlightTag
          fontSize="small"
          hue={highlightProps.hue}
          arcNames={highlightProps.arcNames}
          highlightNumber={highlightProps.highlightNumber}
          objectText={highlightProps.objectText}
          onObjectTextClick={onHighlightObjectClick}
          onHighlightClick={onHighlightClick}
        />
        <BlurbExcerpt
          highlightId={highlightProps.highlightId}
          highlightHue={highlightProps.hue}
          htmlString={excerptProps.htmlString}
          maxLines={expanded ? 0 : excerptProps.maxLines ?? 3}
        />
        {expanded && (
          <RelationsTable expanded={expanded} relations={relations} editable />
        )}
      </div>
    </BlurbWrapper>
  );
};
