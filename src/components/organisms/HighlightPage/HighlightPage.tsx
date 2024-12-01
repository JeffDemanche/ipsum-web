import { Collapse } from "@mui/material";
import cx from "classnames";
import { RelationsTableConnectedProps } from "components/hooks/use-arc-relations-table-connected";
import { CommentsConnectedProps } from "components/hooks/use-comments-connected";
import { Comments } from "components/molecules/Comments";
import { PageHeaderHighlight } from "components/molecules/PageHeader";
import { PageLayout } from "components/molecules/PageLayout";
import { hueSwatch } from "components/styles";
import React, { FunctionComponent } from "react";

import styles from "./HighlightPage.less";
import { HighlightPageSectionAttributes } from "./HighlightPageSectionAttributes";
import { HighlightPageSectionComments } from "./HighlightPageSectionComments";
import { HighlightPageSectionExcerpt } from "./HighlightPageSectionExcerpt";

interface HighlightPageProps {
  className?: string;

  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onClose?: () => void;

  relationTableProps: RelationsTableConnectedProps;

  highlight: {
    id: string;
    htmlString: string;
    hue: number;
    arcNames: string[];
    highlightNumber: number;
    objectText: string;
    relations: React.ComponentProps<
      typeof HighlightPageSectionAttributes
    >["relations"];

    comments: React.ComponentProps<
      typeof HighlightPageSectionComments
    >["comments"];
  };

  commentsProps: CommentsConnectedProps;
}

export const HighlightPage: FunctionComponent<HighlightPageProps> = ({
  className,
  highlight,
  expanded,
  onExpand,
  onCollapse,
  onClose,
  relationTableProps,
  commentsProps,
}) => {
  return (
    <div className={cx(className, styles["highlight-page-wrapper"])}>
      <PageHeaderHighlight
        highlight={{
          hue: highlight.hue,
          arcNames: highlight.arcNames,
          highlightNumber: highlight.highlightNumber,
          objectText: highlight.objectText,
        }}
        expanded={expanded}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onClose={onClose}
      />
      <Collapse in={expanded} orientation="vertical">
        <div
          className={styles["highlight-page-content"]}
          style={{
            backgroundColor: hueSwatch(highlight.hue, "light_background"),
          }}
        >
          <PageLayout
            rows={[
              {
                sections: [
                  {
                    elevated: true,
                    component: (
                      <HighlightPageSectionExcerpt
                        highlightId={highlight.id}
                        highlightHue={highlight.hue}
                        htmlString={highlight.htmlString}
                      />
                    ),
                  },
                ],
              },
              {
                sections: [
                  {
                    elevated: false,
                    component: (
                      <HighlightPageSectionAttributes
                        highlightId={highlight.id}
                        relations={highlight.relations}
                        relationTableProps={relationTableProps}
                      />
                    ),
                  },
                ],
              },
              {
                sections: [
                  {
                    elevated: true,
                    component: <Comments {...commentsProps} />,
                  },
                ],
              },
            ]}
          />
        </div>
      </Collapse>
    </div>
  );
};
