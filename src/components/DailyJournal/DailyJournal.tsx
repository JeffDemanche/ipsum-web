import { Paper, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import React, { useCallback, useContext, useMemo } from "react";
import styles from "./DailyJournal.less";
import { DailyJournalURLLayer, useModifySearchParams } from "util/url";
import { IpsumDay, useDateString } from "util/dates";
import { JournalEntryToday } from "./JournalEntryToday";
import { JournalEntryPast } from "./JournalEntryPast";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import cx from "classnames";
import { LayerContext } from "components/Diptych";
import { MonthlyPaginatedList } from "components/MonthlyPaginatedList";
import { CalendarMonth, Today } from "@mui/icons-material";
import { LayerHeader } from "components/LayerHeader";
import { TestIds } from "util/test-ids";

const DailyJournalQuery = gql(`
  query DailyJournal {
    recentJournalEntries {
      entryKey
    }
  }
`);

interface DailyJournalProps {
  showToday?: boolean;
}

export const DailyJournal: React.FunctionComponent<DailyJournalProps> = ({
  showToday = true,
}) => {
  const { layer, layerIndex } = useContext(LayerContext);
  if (layer.type !== "daily_journal") {
    throw new Error("DailyJournal must be used in a DailyJournal layer");
  }

  const { data } = useQuery(DailyJournalQuery);

  const allEntryKeys = useMemo(
    () => data?.recentJournalEntries.map((e) => e.entryKey),
    [data]
  );

  const today = useDateString(30000, "entry-printed-date");

  const modifySearchParams = useModifySearchParams<"journal">();

  const focusedDateURLFormat = layer?.focusedDate ?? today;

  const todayEntryComponent = (
    <JournalEntryToday entryKey={today} key={today}></JournalEntryToday>
  );

  const entryEditorComponents =
    allEntryKeys &&
    allEntryKeys
      .filter(
        (entryKey) =>
          entryKey !== today &&
          (!layer.visibleDates ||
            layer.visibleDates.includes(
              IpsumDay.fromString(entryKey, "entry-printed-date").toString(
                "url-format"
              )
            ))
      )
      .map((sortedEntryKey, i) => {
        return {
          index: i,
          key: sortedEntryKey,
          day: IpsumDay.fromString(sortedEntryKey, "entry-printed-date"),
          content: (
            <JournalEntryPast
              entryKey={sortedEntryKey}
              showDivider={i !== allEntryKeys.length - 1}
              key={sortedEntryKey}
            ></JournalEntryPast>
          ),
        };
      });

  const paperRef = React.useRef<HTMLDivElement>(null);

  const setMode = useCallback(
    (mode: "today" | "past") => {
      modifySearchParams((searchParams) => {
        const newLayers = [...searchParams.layers];
        if (newLayers[layerIndex].type === "daily_journal") {
          newLayers[layerIndex] = {
            ...newLayers[layerIndex],
            mode,
          } as DailyJournalURLLayer;
          if (mode === "today") {
            (newLayers[layerIndex] as DailyJournalURLLayer).focusedDate =
              IpsumDay.today().toString("url-format");
          }
        }

        return {
          ...searchParams,
          layers: newLayers,
        };
      });
    },
    [layerIndex, modifySearchParams]
  );

  const currentMode = !layer.mode ? "today" : layer.mode;

  return (
    <div
      className={styles["daily-journal"]}
      data-testid={TestIds.DailyJournal.DailyJournal}
    >
      <Paper ref={paperRef} className={cx(styles["paper"])} variant="shadowed">
        <LayerHeader>
          <ToggleButtonGroup>
            <Tooltip title="Today's entry">
              <ToggleButton
                onClick={() => {
                  setMode("today");
                }}
                value="today"
                selected={currentMode === "today"}
              >
                <Today></Today>
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Previous entries">
              <ToggleButton
                onClick={() => {
                  setMode("past");
                }}
                value="past"
                selected={currentMode === "past"}
              >
                <CalendarMonth></CalendarMonth>
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </LayerHeader>
        {currentMode === "today" ? (
          <div
            style={{ height: "100%", overflowY: "auto", paddingRight: "4px" }}
          >
            {todayEntryComponent}
          </div>
        ) : (
          <MonthlyPaginatedList
            focusedElement={{
              key: focusedDateURLFormat,
            }}
            rangeMode="month"
            elements={entryEditorComponents}
            onFocusedDayChanged={(focusedDay) => {
              focusedDay &&
                modifySearchParams((searchParams) => {
                  return {
                    ...searchParams,
                    layers: [
                      ...searchParams.layers.slice(0, layerIndex),
                      {
                        ...searchParams.layers[layerIndex],
                        focusedDate: focusedDay.toString("url-format"),
                      },
                      ...searchParams.layers.slice(layerIndex + 1),
                    ],
                  };
                });
            }}
          />
        )}
      </Paper>
    </div>
  );
};
