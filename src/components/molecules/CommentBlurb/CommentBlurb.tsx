import cx from "classnames";
import { BlurbWrapper } from "components/molecules/BlurbWrapper";
import { HighlightTag } from "components/molecules/HighlightTag";
import React, { useState } from "react";
import { Arc, Day } from "util/apollo";
import { IpsumDay } from "util/dates";

import { Entry } from "../Entry";
import styles from "./CommentBlurb.less";

type HighlightObject =
  | {
      __typename: Day["__typename"];
      day: string;
    }
  | {
      __typename: Arc["__typename"];
      id: string;
    };

interface CommentBlurbProps {
  className?: string;

  today: IpsumDay;

  selected?: boolean;
  onSelect?: () => void;

  defaultExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;

  maxLines?: number;
  showHighlightTag?: boolean;

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
      object: HighlightObject;
    };
  };

  onCreateEntry?: (htmlString: string) => string;
  onDeleteEntry?: (entryKey: string) => void;
  onUpdateEntry?: (args: { entryKey: string; htmlString: string }) => boolean;
  onCreateHighlight?: () => string;
  onDeleteHighlight?: (highlightId: string) => void;
  onHighlightClick?: (highlightId: string) => void;
  onHighlightObjectClick?: (
    highlightId: string,
    object: HighlightObject
  ) => void;
}

export const CommentBlurb: React.FunctionComponent<CommentBlurbProps> = ({
  className,
  today,
  selected,
  onSelect,
  defaultExpanded = false,
  onExpand,
  onCollapse,
  maxLines,
  showHighlightTag = true,
  comment,
  onCreateEntry,
  onDeleteEntry,
  onUpdateEntry,
  onCreateHighlight,
  onDeleteHighlight,
  onHighlightClick,
  onHighlightObjectClick,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const yesterday = today.add(-1);

  const editable = today.equals(comment.day) || yesterday.equals(comment.day);

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
          {showHighlightTag && (
            <HighlightTag
              highlightNumber={comment.highlight.highlightNumber}
              hue={comment.highlight.hue}
              objectText={comment.highlight.objectText}
              arcNames={comment.highlight.arcNames}
              fontSize="x-small"
              onHighlightClick={() => onHighlightClick(comment.highlight.id)}
              onObjectTextClick={() =>
                onHighlightObjectClick(
                  comment.highlight.id,
                  comment.highlight.object
                )
              }
            />
          )}
        </div>
        <Entry
          editorNamespace={`comment-blurb:${comment.id}`}
          entryKey={`comment-entry:${comment.id}`}
          editable={editable}
          showHighlights={expanded}
          maxLines={expanded ? 0 : maxLines ?? 3}
          highlights={comment.commentEntry.highlights}
          htmlString={comment.commentEntry.htmlString}
          createEntry={onCreateEntry}
          updateEntry={onUpdateEntry}
          deleteEntry={onDeleteEntry}
          createHighlight={onCreateHighlight}
          deleteHighlight={onDeleteHighlight}
          onHighlightClick={onHighlightClick}
        />
      </div>
    </BlurbWrapper>
  );
};
