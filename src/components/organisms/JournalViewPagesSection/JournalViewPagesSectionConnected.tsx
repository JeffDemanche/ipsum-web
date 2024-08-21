import cx from "classnames";
import { FormattingControls } from "components/molecules/FormattingControls";
import React from "react";
import { urlSetDailyJournalLayerDay, useUrlAction } from "util/api";
import { IpsumDay } from "util/dates";
import { useIpsumSearchParams } from "util/state";

import { ArcPageConnected } from "../ArcPage";
import { DailyJournalEntryConnected } from "../DailyJournalEntry";
import { HighlightPageConnected } from "../HighlightPage";
import styles from "./JournalViewPagesSection.less";

interface JournalViewPagesSectionConnectedProps {
  className?: string;
}

export const JournalViewPagesSectionConnected: React.FunctionComponent<
  JournalViewPagesSectionConnectedProps
> = ({ className }) => {
  const { layers } = useIpsumSearchParams<"journal">();

  const setDailyJournalLayerDay = useUrlAction(urlSetDailyJournalLayerDay);

  const onDailyJournalDayChange = (index: number, day: IpsumDay) => {
    setDailyJournalLayerDay({ index, day });
  };

  const pages = layers?.map((layer, i) => {
    switch (layer.type) {
      case "daily_journal":
        return (
          <DailyJournalEntryConnected
            key={layer.day}
            day={IpsumDay.fromString(layer.day, "url-format")}
            onDayChange={(day) => onDailyJournalDayChange(i, day)}
          />
        );
      case "arc_detail":
        return <ArcPageConnected key={layer.arcId} arcId={layer.arcId} />;
      case "highlight_detail":
        return (
          <HighlightPageConnected
            key={layer.highlightId}
            highlightId={layer.highlightId}
          />
        );
      default:
        return null;
    }
  });

  return (
    <div className={cx(styles["journal-view-pages-section"], className)}>
      <FormattingControls />
      <div className={styles["pages"]}>{pages}</div>
    </div>
  );
};
