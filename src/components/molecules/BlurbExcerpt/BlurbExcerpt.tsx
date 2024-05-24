import cx from "classnames";
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
  highlightHue: number | undefined;

  /**
   * Will default to displaying the entire HTML string.
   */
  showAll?: boolean;
}

export const BlurbExcerpt: React.FunctionComponent<BlurbExcerptProps> = ({
  htmlString,
  maxLines,
  highlightId,
  showAll,
  highlightHue,
}) => {
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
    </div>
  );
};
