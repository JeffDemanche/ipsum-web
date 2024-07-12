import { Type } from "components/atoms/Type";
import { grey100 } from "components/styles";
import React from "react";
import { IpsumDay } from "util/dates";

import styles from "./PageHeader.less";
import { PageHeaderNavButtons } from "./PageHeaderNavButtons";

interface PageHeaderDailyJournalProps {
  day: IpsumDay;

  expanded: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export const PageHeaderDailyJournal: React.FunctionComponent<
  PageHeaderDailyJournalProps
> = ({ day, expanded, onCollapse, onExpand }) => {
  return (
    <div className={styles["page-header"]}>
      <Type variant="sans" size="medium" weight="light" color={grey100}>
        {day.toString("entry-printed-date")}
      </Type>
      <PageHeaderNavButtons
        showCollapse={expanded}
        showExpand={!expanded}
        showClose
        onCollapse={onCollapse}
        onExpand={onExpand}
      />
    </div>
  );
};