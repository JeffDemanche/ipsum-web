import { KeyboardArrowUpSharp } from "@mui/icons-material";
import cx from "classnames";
import { MiniButton } from "components/atoms/MiniButton";
import type { RelationsTableConnectedProps } from "components/hooks/use-arc-relations-table-connected";
import type { HighlightFunctionButtonsConnectedProps } from "components/hooks/use-highlight-function-buttons-connected";
import type { HighlightSRSButtonsConnectedProps } from "components/hooks/use-highlight-srs-buttons-connected";
import { BlurbExcerpt } from "components/molecules/BlurbExcerpt";
import { RelationsTable } from "components/molecules/RelationsTable";
import { grey700, hueSwatch } from "components/styles";
import React, { useState } from "react";
import { TestIds } from "util/test-ids";

import { HighlightFunctionButtons } from "../HighlightFunctionButtons";
import { HighlightSRSButtons } from "../HighlightSRSButtons/HighlightSRSButtons";
import { HighlightTag } from "../HighlightTag";
import styles from "./HighlightBlurb.less";

interface HighlightBlurbProps {
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;

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

  highlightSRSButtonsProps: HighlightSRSButtonsConnectedProps;
  highlightFunctionButtonsProps: HighlightFunctionButtonsConnectedProps;

  relationsTableProps: RelationsTableConnectedProps;
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
  relationsTableProps,
  onHighlightClick,
  onHighlightObjectClick,
  highlightSRSButtonsProps,
  highlightFunctionButtonsProps,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);

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

  return (
    <div
      data-testid={TestIds.HighlightBlurb.HighlightBlurb}
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
        className={cx(
          styles["blurb-left-column"],
          expanded && styles["expanded"]
        )}
      >
        <HighlightSRSButtons
          orientation="vertical"
          {...highlightSRSButtonsProps}
        />
        <div style={{ flexGrow: "1" }}></div>
        <MiniButton
          tooltip="Collapse highlight"
          foregroundColor={grey700}
          onClick={onBlurbCollapse}
        >
          <KeyboardArrowUpSharp />
        </MiniButton>
      </div>
      <div className={styles["blurb-right-column"]}>
        <div className={styles["blurb-header"]}>
          <HighlightFunctionButtons
            orientation="horizontal"
            showDeleteButton={expanded}
            {...highlightFunctionButtonsProps}
          />
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
            subjectType="Highlight"
            subjectId={highlightProps.highlightId}
            {...relationsTableProps}
          />
        )}
      </div>
    </div>
  );
};
