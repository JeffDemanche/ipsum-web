import { Type } from "components/atoms/Type";
import { BlurbExcerpt } from "components/molecules/BlurbExcerpt";
import { BlurbWrapper } from "components/molecules/BlurbWrapper";
import { HighlightTag } from "components/molecules/HighlightTag";
import React, { useState } from "react";
import { IpsumDay } from "util/dates";

import styles from "./CommentBlurb.less";

interface CommentBlurbProps {
  className?: string;

  selected?: boolean;
  onSelect?: () => void;

  defaultExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;

  excerptProps: { htmlString: string; maxLines?: number };
  comment: {
    id: string;
    day: IpsumDay;
    highlight: {
      id: string;
      objectText: string;
      hue: number;
      highlightNumber: number;
      arcNames: string[];
    };
  };
}

export const CommentBlurb: React.FunctionComponent<CommentBlurbProps> = ({
  className,
  selected,
  onSelect,
  defaultExpanded,
  onExpand,
  onCollapse,
  excerptProps,
  comment,
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
        <div className={styles["blurb-header"]}>
          <Type variant="serif" size="x-small" underline>
            {comment.day.toString("entry-printed-date")}
          </Type>
          <HighlightTag
            highlightNumber={comment.highlight.highlightNumber}
            hue={comment.highlight.hue}
            objectText={comment.highlight.objectText}
            arcNames={comment.highlight.arcNames}
            fontSize="x-small"
          />
        </div>
        <BlurbExcerpt
          highlightId={comment.highlight.id}
          highlightHue={comment.highlight.hue}
          htmlString={excerptProps.htmlString}
          maxLines={expanded ? 0 : excerptProps.maxLines ?? 3}
        />
      </div>
    </BlurbWrapper>
  );
};
