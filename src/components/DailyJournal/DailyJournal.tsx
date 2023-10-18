import { Paper, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import React, { useCallback, useContext, useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import styles from "./DailyJournal.less";
import { DailyJournalURLLayer, useModifySearchParams } from "util/url";
import { IpsumDay, useDateString } from "util/dates";
import { JournalEntryToday } from "./JournalEntryToday";
import { JournalEntryPast } from "./JournalEntryPast";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import cx from "classnames";
import { LayerContext } from "components/Diptych";
import { PaginatedList } from "components/PaginatedList";
import { CalendarMonth, Today } from "@mui/icons-material";
import { LayerHeader } from "components/LayerHeader";

const DailyJournalQuery = gql(`
  query DailyJournal {
    journalEntryKeys
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

  const allEntryKeys = useMemo(() => {
    const ascendingKeys = [...(data?.journalEntryKeys ?? [])];
    ascendingKeys.reverse();
    return ascendingKeys;
  }, [data]);

  const [visibleEntryKeys, setVisibleEntryKeys] = useState(allEntryKeys);

  const today = useDateString(30000, "entry-printed-date");

  const modifySearchParams = useModifySearchParams<"journal">();

  const focusedDateURLFormat = layer?.focusedDate ?? today;
  const focusedDateEntryKeyFormat = IpsumDay.fromString(
    focusedDateURLFormat,
    "url-format"
  ).toString("entry-printed-date");

  const todayEntryComponent = (
    <JournalEntryToday entryKey={today} key={today}></JournalEntryToday>
  );

  const entryEditorComponents =
    visibleEntryKeys &&
    visibleEntryKeys
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
          content: (
            <JournalEntryPast
              entryKey={sortedEntryKey}
              showDivider={i !== visibleEntryKeys.length - 1}
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
    <div className={styles["daily-journal"]}>
      <Paper ref={paperRef} className={cx(styles["paper"])} variant="shadowed">
        <LayerHeader>
          <ToggleButtonGroup>
            <Tooltip title="Previous entries">
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
            <Tooltip title="Today's entry">
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
          <SimpleBar className={styles["daily-journal-scroller"]}>
            {todayEntryComponent}
          </SimpleBar>
        ) : (
          <PaginatedList
            className={styles["daily-journal-scroller"]}
            defaultFocusedElement={{
              index: entryEditorComponents.findIndex(
                (element) => element.key === focusedDateEntryKeyFormat
              ),
              key: focusedDateEntryKeyFormat,
            }}
            numVisibleAroundFocusedElement={5}
            amountToLoad={10}
            elements={entryEditorComponents}
            onFocusedElementChanged={(focusedElement) => {
              modifySearchParams((searchParams) => {
                return {
                  ...searchParams,
                  layers: [
                    ...searchParams.layers.slice(0, layerIndex),
                    {
                      ...searchParams.layers[layerIndex],
                      focusedDate: IpsumDay.fromString(
                        focusedElement.key,
                        "entry-printed-date"
                      ).toString("url-format"),
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
