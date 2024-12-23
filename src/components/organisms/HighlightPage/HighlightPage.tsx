import { Collapse } from "@mui/material";
import cx from "classnames";
import type { RelationsTableConnectedProps } from "components/hooks/use-arc-relations-table-connected";
import type { HighlightFunctionButtonsConnectedProps } from "components/hooks/use-highlight-function-buttons-connected";
import type { HighlightSRSButtonsConnectedProps } from "components/hooks/use-highlight-srs-buttons-connected";
import type {
  CommentsNavigatorConnectedProps} from "components/molecules/CommentsNavigator";
import {
  CommentsNavigator
} from "components/molecules/CommentsNavigator";
import { PageHeaderHighlight } from "components/molecules/PageHeader";
import { PageLayout } from "components/molecules/PageLayout";
import { hueSwatch } from "components/styles";
import type { FunctionComponent } from "react";
import React from "react";
import { TestIds } from "util/test-ids";

import styles from "./HighlightPage.less";
import { HighlightPageSectionAttributes } from "./HighlightPageSectionAttributes";
import { HighlightPageSectionExcerpt } from "./HighlightPageSectionExcerpt";

interface HighlightPageProps {
  className?: string;

  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onClose?: () => void;

  highlightSRSButtonsProps: HighlightSRSButtonsConnectedProps;
  highlightFunctionButtonsProps: HighlightFunctionButtonsConnectedProps;
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
  };

  commentsProps: CommentsNavigatorConnectedProps;
}

export const HighlightPage: FunctionComponent<HighlightPageProps> = ({
  className,
  highlight,
  expanded,
  onExpand,
  onCollapse,
  onClose,
  highlightFunctionButtonsProps,
  highlightSRSButtonsProps,
  relationTableProps,
  commentsProps,
}) => {
  return (
    <div
      data-testid={TestIds.HighlightPage.HighlightPage}
      className={cx(className, styles["highlight-page-wrapper"])}
    >
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
            border: `2px solid ${hueSwatch(highlight.hue, "light_background")}`,
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
                        highlightFunctionButtonsProps={
                          highlightFunctionButtonsProps
                        }
                        highlightSRSButtonsProps={highlightSRSButtonsProps}
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
                    elevated: false,
                    component: (
                      <hr
                        style={{
                          borderColor: hueSwatch(
                            highlight.hue,
                            "on_light_background_subtle"
                          ),
                        }}
                      ></hr>
                    ),
                  },
                ],
              },
              {
                sections: [
                  {
                    elevated: false,
                    component: (
                      <CommentsNavigator
                        className={styles["comments-section"]}
                        {...commentsProps}
                      />
                    ),
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
