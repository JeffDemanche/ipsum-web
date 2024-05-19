import { MoreHoriz } from "@mui/icons-material";
import cx from "classnames";
import { MiniButton } from "components/atoms/MiniButton";
import { grey700 } from "components/styles";
import { editorStyles } from "components/styles/editor";
import React, { useMemo } from "react";
import { excerptDivString } from "util/excerpt";

import styles from "./BlurbExcerpt.less";

interface BlurbExcerptProps {
  htmlString: string;
  maxLines?: number;

  /**
   * If `showAll` is false, HTML will initially only display content between
   * the first and last tags with the data-highlight-id attribute equal to this
   * prop.
   */
  highlightId: string | undefined;

  /**
   * Will default to displaying the entire HTML string.
   */
  showAll?: boolean;

  highlightHue?: number;

  /**
   * Allow showing non-highlight text above and below the visible range.
   */
  allowContext?: boolean;
}

export const BlurbExcerpt: React.FunctionComponent<BlurbExcerptProps> = ({
  htmlString,
  maxLines,
  highlightId,
  showAll,
  highlightHue,
  allowContext = true,
}) => {
  const showContextButtons = !showAll && allowContext;

  const excerptedHtmlString = useMemo(() => {
    if (showAll || !highlightId) {
      return htmlString;
    }

    return excerptDivString({
      entryDomString: htmlString,
      highlightId,
      highlightHue,
    });
  }, [highlightHue, highlightId, htmlString, showAll]);

  return (
    <div className={styles["excerpt"]}>
      {showContextButtons && (
        <MiniButton foregroundColor={grey700}>
          <MoreHoriz fontSize="small" />
        </MiniButton>
      )}
      <div
        style={{ WebkitLineClamp: maxLines, lineClamp: maxLines }}
        className={cx(
          editorStyles["styled-editor"],
          maxLines && styles["truncate"]
        )}
        dangerouslySetInnerHTML={{
          __html:
            excerptedHtmlString !== ""
              ? excerptedHtmlString
              : "<p><em>(No excerpt)</em></p>",
        }}
      />
      {showContextButtons && (
        <MiniButton foregroundColor={grey700}>
          <MoreHoriz fontSize="small" />
        </MiniButton>
      )}
    </div>
  );
};
