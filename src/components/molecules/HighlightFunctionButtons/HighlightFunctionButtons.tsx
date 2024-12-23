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
  | { type: "Up for review"; ease: number }
  | { type: "Not up for review"; ease: number; daysUntilReview: number }
  | { type: "Reviewed"; ease: number };

interface HighlightFunctionButtonsProps {
  orientation: "horizontal" | "vertical";
  highlightHue: number;
  notificationState?: HighlightFunctionButtonsNotificationState;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

export const HighlightFunctionButtons: React.FunctionComponent<
  HighlightFunctionButtonsProps
> = ({
  orientation,
  highlightHue,
  notificationState,
  onDelete,
  showDeleteButton = true,
}) => {
  let blurbNotification = null;
  if (notificationState?.type === "Up for review") {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip
          title={
            <>
              <p>Up for review</p>
              <p>Ease: {notificationState.ease}</p>
            </>
          }
        >
          <PriorityHighSharp
            style={{
              color: hueSwatch(highlightHue, "on_light_background"),
            }}
          />
        </Tooltip>
      </div>
    );
  } else if (notificationState?.type === "Reviewed") {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip
          title={
            <>
              <p>Reviewed</p>
              <p>Ease: {notificationState.ease}</p>
            </>
          }
        >
          <DoneSharp
            style={{
              color: hueSwatch(highlightHue, "on_light_background"),
            }}
          />
        </Tooltip>
      </div>
    );
  } else if (notificationState?.type === "Not up for review") {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip
          title={
            <>
              <p>Not up for review</p>
              <p>Ease: {notificationState.ease}</p>
            </>
          }
        >
          <Type size="small" color={grey700}>
            {notificationState.daysUntilReview}d
          </Type>
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      data-testid={TestIds.HighlightFunctionButtons.HighlightFunctionButtons}
      className={cx(styles["function-buttons"], styles[orientation])}
    >
      {blurbNotification}
      {showDeleteButton && onDelete && (
        <MiniButton
          data-testid={TestIds.HighlightFunctionButtons.DeleteButton}
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
