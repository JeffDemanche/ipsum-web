import {
  ArrowDropDownSharp,
  ArrowDropUpSharp,
  DeleteSharp,
  KeyboardArrowUpSharp,
  PriorityHighSharp,
} from "@mui/icons-material";
import cx from "classnames";
import { MiniButton } from "components/atoms/MiniButton";
import { BlurbExcerpt } from "components/molecules/BlurbExcerpt";
import { HighlightTag } from "components/molecules/HighlightTag";
import { RelationsTable } from "components/molecules/RelationsTable";
import { grey500, grey700, hueSwatch } from "components/styles";
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

  onDelete?: () => void;

  onRateUp?: () => void;
  onRateDown?: () => void;

  onHighlightClick?: () => void;
  onHighlightObjectClick?: () => void;

  relationsTableProps: Pick<
    React.ComponentProps<typeof RelationsTable>,
    "onCreateRelation" | "onDeleteRelation" | "arcResults" | "onArcSearch"
  >;
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
  onDelete,
  onRateUp,
  onRateDown,
  onHighlightClick,
  onHighlightObjectClick,
  relationsTableProps,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const onBlurbExpand = () => {
    setExpanded(true);
    onExpand?.();
  };

  const onBlurbCollapse = () => {
    setExpanded(false);
    onCollapse?.();
  };

  const onBlurbClick = () => {
    if (!expanded) {
      onBlurbExpand();
    }
  };

  const remind = true;

  const blurbRatingControls = (
    <>
      <MiniButton
        tooltip="Important"
        onClick={onRateUp}
        foregroundColor={grey500}
      >
        <ArrowDropUpSharp />
      </MiniButton>
      <MiniButton
        tooltip="Not important"
        onClick={onRateDown}
        foregroundColor={grey500}
      >
        <ArrowDropDownSharp />
      </MiniButton>
      <div style={{ flexGrow: "1" }}></div>
      <MiniButton
        tooltip="Collapse highlight"
        foregroundColor={grey700}
        onClick={onBlurbCollapse}
      >
        <KeyboardArrowUpSharp />
      </MiniButton>
    </>
  );

  return (
    <div
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onClick={onBlurbClick}
      className={cx(
        className,
        styles["highlight-blurb-wrapper"],
        expanded && styles["expanded"]
      )}
      style={{
        borderColor: hueSwatch(highlightProps.hue, "light_background"),
      }}
    >
      <div
        className={cx(styles["blurb-header"], expanded && styles["expanded"])}
      >
        <div className={styles["blurb-action-buttons"]}>
          {remind && (
            <MiniButton
              foregroundColor={hueSwatch(
                highlightProps.hue,
                "on_light_background"
              )}
              style={{ height: "16px", width: "16px" }}
            >
              <PriorityHighSharp />
            </MiniButton>
          )}
          <div className={styles["blurb-expanded-action-buttons"]}>
            <MiniButton
              onClick={onDelete}
              tooltip="Delete highlight"
              foregroundColor={grey700}
            >
              <DeleteSharp />
            </MiniButton>
          </div>
        </div>
        <HighlightTag
          fontSize="small"
          hue={highlightProps.hue}
          arcNames={highlightProps.arcNames}
          highlightNumber={highlightProps.highlightNumber}
          objectText={highlightProps.objectText}
          onObjectTextClick={onHighlightObjectClick}
          onHighlightClick={onHighlightClick}
        />
      </div>
      <div className={styles["blurb-content"]}>
        <div
          className={cx(
            styles["blurb-left-column"],
            expanded && styles["expanded"]
          )}
        >
          {blurbRatingControls}
        </div>
        <div className={styles["blurb-right-column"]}>
          <BlurbExcerpt
            highlightId={highlightProps.highlightId}
            highlightHue={highlightProps.hue}
            htmlString={excerptProps.htmlString}
            maxLines={expanded ? 0 : excerptProps.maxLines ?? 3}
            showLeftBorder={expanded}
          />
          {expanded && (
            <RelationsTable
              expanded={expanded}
              relations={relations}
              editable
              {...{
                ...relationsTableProps,
                subjectType: "Highlight",
                subjectId: highlightProps.highlightId,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
