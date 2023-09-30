import { Paper } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import styles from "./DailyJournal.less";
import { useDebouncedCallback } from "util/hooks";
import { DailyJournalURLLayer, useModifySearchParams } from "util/url";
import { IpsumDay, useDateString } from "util/dates";
import { JournalEntryToday } from "./JournalEntryToday";
import { JournalEntryPast } from "./JournalEntryPast";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import cx from "classnames";

const DailyJournalQuery = gql(`
  query DailyJournal {
    journalEntryKeys
  }
`);

interface DailyJournalProps {
  layer: DailyJournalURLLayer;
  showToday?: boolean;
}

export const DailyJournal: React.FunctionComponent<DailyJournalProps> = ({
  layer,
  showToday = true,
}) => {
  const { data } = useQuery(DailyJournalQuery);

  const allEntryKeys = useMemo(() => {
    const ascendingKeys = [...(data?.journalEntryKeys ?? [])];
    ascendingKeys.reverse();
    return ascendingKeys;
  }, [data]);

  // This is used to prevent the scroll focus from jumping arounds when the
  // focusedDate is set as a result of scroll changes.
  const [dontScrollTo, setDontScrollTo] = React.useState<string[]>([]);

  const [visibleEntryKeys, setVisibleEntryKeys] = useState(allEntryKeys);

  const loadAroundDay = useCallback(
    (day: IpsumDay, buffer = 4) => {
      const dayIndex = allEntryKeys.findIndex(
        (entryKey) => entryKey === day.toString("entry-printed-date")
      );

      const visibleEntryKeys = allEntryKeys.slice(
        Math.max(0, dayIndex - buffer),
        Math.min(allEntryKeys.length, dayIndex + buffer)
      );

      setVisibleEntryKeys(visibleEntryKeys);
    },
    [allEntryKeys]
  );

  const today = useDateString(30000, "entry-printed-date");

  const modifySearchParams = useModifySearchParams<"journal">();

  const onScroll = useDebouncedCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const target = e.target as HTMLDivElement;

      const elements = target.querySelector(
        `.${styles["past-entries"]}`
      ).children;

      const parentRect = target.getBoundingClientRect();

      const allElementsInView: HTMLDivElement[] = [...elements].filter(
        (element: HTMLDivElement) => {
          const divRect = element.getBoundingClientRect();
          const isPartiallyVisible =
            divRect.top < parentRect.bottom && divRect.bottom > parentRect.top;
          return isPartiallyVisible;
        }
      ) as HTMLDivElement[];

      if (!allElementsInView.length) return;

      setDontScrollTo([allElementsInView[0].dataset.entryKey]);
      modifySearchParams((searchParams) => {
        return {
          ...searchParams,
          layers: [
            {
              ...searchParams.layers[0],
              focusedDate: IpsumDay.fromString(
                allElementsInView[0].dataset.entryKey,
                "entry-printed-date"
              ).toString("url-format"),
            },
            ...searchParams.layers.slice(1),
          ],
        };
      });
    },
    200
  );

  const focusedDateURLFormat = layer?.focusedDate ?? today;
  const focusedDateEntryKeyFormat = IpsumDay.fromString(
    focusedDateURLFormat,
    "url-format"
  ).toString("entry-printed-date");

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAroundDay(
      IpsumDay.fromString(focusedDateEntryKeyFormat, "entry-printed-date")
    );

    if (
      focusedDateEntryKeyFormat &&
      !dontScrollTo.includes(focusedDateEntryKeyFormat)
    ) {
      const scrollerNode = scrollRef.current;
      const focusedElement = scrollerNode.querySelector(
        `[data-entry-key="${focusedDateEntryKeyFormat}"]`
      ) as HTMLDivElement;

      if (focusedElement) {
        scrollerNode.scrollTo(0, focusedElement.offsetTop - 10);
      }
    }
  }, [dontScrollTo, focusedDateEntryKeyFormat, loadAroundDay]);

  const todayEntryComponent = (
    <JournalEntryToday entryKey={today} key={today}></JournalEntryToday>
  );

  const entryEditorComponents =
    visibleEntryKeys &&
    visibleEntryKeys
      .filter((entryKey) => entryKey !== today)
      .map((sortedEntryKey, i) => {
        return (
          <JournalEntryPast
            entryKey={sortedEntryKey}
            showDivider={i !== visibleEntryKeys.length - 1}
            key={sortedEntryKey}
          ></JournalEntryPast>
        );
      });

  const todayPaperRef = React.useRef<HTMLDivElement>(null);
  const pastPaperRef = React.useRef<HTMLDivElement>(null);

  const [todayHasFocus, setTodayHasFocus] = useState(false);
  const [pastHasFocus, setPastHasFocus] = useState(true);

  return (
    <div className={styles["daily-journal"]}>
      <Paper
        ref={todayPaperRef}
        onMouseDown={() => {
          setTodayHasFocus(true);
          setPastHasFocus(false);
        }}
        className={cx(
          styles["today-paper"],
          todayHasFocus && styles["focused"]
        )}
        variant="shadowed"
      >
        <SimpleBar className={styles["daily-journal-scroller"]}>
          {todayEntryComponent}
        </SimpleBar>
      </Paper>
      <Paper
        ref={pastPaperRef}
        onMouseDown={() => {
          setTodayHasFocus(false);
          setPastHasFocus(true);
        }}
        className={cx(styles["past-paper"], pastHasFocus && styles["focused"])}
        variant="shadowed"
      >
        <SimpleBar
          className={styles["daily-journal-scroller"]}
          scrollableNodeProps={{ onScroll, ref: scrollRef }}
        >
          <div className={styles["past-entries"]}>{entryEditorComponents}</div>
        </SimpleBar>
      </Paper>
    </div>
  );
};
