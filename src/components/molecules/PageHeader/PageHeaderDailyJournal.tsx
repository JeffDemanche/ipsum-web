import { Type } from "components/atoms/Type";
import { grey100 } from "components/styles";
import React from "react";
import { IpsumDay } from "util/dates";

import styles from "./PageHeader.less";

interface PageHeaderDailyJournalProps {
  day: IpsumDay;
}

export const PageHeaderDailyJournal: React.FunctionComponent<
  PageHeaderDailyJournalProps
> = ({ day }) => {
  return (
    <div className={styles["page-header"]}>
      <Type variant="sans" size="medium" weight="light" color={grey100}>
        {day.toString("entry-printed-date")}
      </Type>
    </div>
  );
};
