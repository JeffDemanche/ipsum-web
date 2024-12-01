import { DeleteSharp, DoneSharp, PriorityHighSharp } from "@mui/icons-material";
import cx from "classnames";
import { MiniButton } from "components/atoms/MiniButton";
import { Tooltip } from "components/atoms/Tooltip";
import { Type } from "components/atoms/Type";
import { grey700, hueSwatch } from "components/styles";
import React from "react";
import { TestIds } from "util/test-ids";

import styles from "./HighlightFunctionButtons.less";

export type HighlightFunctionButtonsNotificationState =
  | { type: "Up for review" }
  | { type: "Not up for review"; daysUntilReview: number }
  | { type: "Reviewed" };

interface HighlightFunctionButtonsProps {
  orientation: "horizontal" | "vertical";
  highlightHue: number;
  notificationState?: HighlightFunctionButtonsNotificationState;
  onDelete?: () => void;
}

export const HighlightFunctionButtons: React.FunctionComponent<
  HighlightFunctionButtonsProps
> = ({ orientation, highlightHue, notificationState, onDelete }) => {
  let blurbNotification = null;
  if (notificationState.type === "Up for review") {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip title="Up for review">
          <PriorityHighSharp
            style={{
              color: hueSwatch(highlightHue, "on_light_background"),
            }}
          />
        </Tooltip>
      </div>
    );
  } else if (notificationState.type === "Reviewed") {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip title="Reviewed">
          <DoneSharp
            style={{
              color: hueSwatch(highlightHue, "on_light_background"),
            }}
          />
        </Tooltip>
      </div>
    );
  } else if (notificationState.type === "Not up for review") {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip title="Not up for review">
          <Type size="small" color={grey700}>
            {notificationState.daysUntilReview}d
          </Type>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={cx(styles["function-buttons"], styles[orientation])}>
      {blurbNotification}
      {onDelete && (
        <MiniButton
          data-testid={TestIds.HighlightBlurb.DeleteButton}
          onClick={onDelete}
          tooltip="Delete highlight"
          foregroundColor={grey700}
        >
          <DeleteSharp />
        </MiniButton>
      )}
    </div>
  );
};
