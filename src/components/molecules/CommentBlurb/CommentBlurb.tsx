import cx from "classnames";
import { Type } from "components/atoms/Type";
import { BlurbWrapper } from "components/molecules/BlurbWrapper";
import { HighlightTag } from "components/molecules/HighlightTag";
import React, { useState } from "react";
import { IpsumDay } from "util/dates";

import { Entry } from "../Entry";
import styles from "./CommentBlurb.less";

interface CommentBlurbProps {
  className?: string;

  selected?: boolean;
  onSelect?: () => void;

  defaultExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;

  maxLines?: number;
  showHighlightTag?: boolean;

  excerptProps: { htmlString: string; maxLines?: number };
  comment: {
    id: string;
    day: IpsumDay;
    commentEntry: {
      htmlString: string;
      highlights: React.ComponentProps<typeof Entry>["highlights"];
    };
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
  defaultExpanded = false,
  onExpand,
  onCollapse,
  maxLines,
  showHighlightTag = true,
  excerptProps,
  comment,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const onBlurbWrapperExpand = () => {
    setExpanded(!expanded);
    onExpand?.();
  };

  const onBlurbWrapperCollapse = () => {
    setExpanded(!expanded);
    onCollapse?.();
  };

  return (
    <BlurbWrapper
      className={cx(
        className,
        styles["comment-blurb-wrapper"],
        expanded && styles["expanded"]
      )}
      collapsible
      defaultExpanded={defaultExpanded}
      onExpand={onBlurbWrapperExpand}
      onCollapse={onBlurbWrapperCollapse}
    >
      <div className={styles["blurb-content"]}>
        <div className={styles["blurb-header"]}>
          <Type variant="serif" size="small">
            {comment.day.toString("entry-printed-date")}
          </Type>
          {showHighlightTag && (
            <HighlightTag
              highlightNumber={comment.highlight.highlightNumber}
              hue={comment.highlight.hue}
              objectText={comment.highlight.objectText}
              arcNames={comment.highlight.arcNames}
              fontSize="x-small"
            />
          )}
        </div>
        <Entry
          editorNamespace="comment"
          editable={false}
          showHighlights={expanded}
          maxLines={expanded ? 0 : maxLines ?? 3}
          highlights={comment.commentEntry.highlights}
          htmlString={comment.commentEntry.htmlString}
        />
      </div>
    </BlurbWrapper>
  );
};
