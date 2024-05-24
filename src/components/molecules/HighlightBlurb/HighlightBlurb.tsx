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
  };
  excerptProps: { htmlString: string; maxLines?: number };
  relations: React.ComponentProps<typeof RelationsTable>["relations"];

  selected?: boolean;
  onSelect?: () => void;

  defaultExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
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
      className={className}
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
        />
        <BlurbExcerpt
          highlightId={highlightProps.highlightId}
          highlightHue={highlightProps.hue}
          htmlString={excerptProps.htmlString}
          maxLines={expanded ? 0 : excerptProps.maxLines ?? 3}
        />
        <RelationsTable expanded={expanded} relations={relations} />
      </div>
    </BlurbWrapper>
  );
};
