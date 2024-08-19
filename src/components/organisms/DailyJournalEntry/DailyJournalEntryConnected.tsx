import { useQuery } from "@apollo/client";
import React, { ComponentProps, useMemo } from "react";
import { urlSetDailyJournalLayerDay, useUrlAction } from "util/api";
import { gql } from "util/apollo";
import { IpsumDay, useToday } from "util/dates";
import { useIpsumSearchParams } from "util/state";

import { DailyJournalEntry } from "./DailyJournalEntry";

interface DailyJournalEntryConnectedProps {
  layerIndex: number;
}

const DailyJournalEntryQuery = gql(`
  query DailyJournalEntryQuery($entryKey: ID!, $day: String!) {
    journalEntryDates(includeEmpty: false)
    journalEntry(entryKey: $entryKey) {
      entryKey
      entry {
        htmlString
        highlights {
          id
          hue
          arcs {
            id
            name
          }
        }
      }
    }
    day(day: $day) {
      comments {
        id
        commentEntry {
          entry {
            entryKey
            htmlString
            highlights {
              id
              hue
              number
              arcs {
                id
                name
              }
            }
          }
        }
        highlight {
          id
          hue
          arcs {
            id
            name
          }
        }
      }
    }
  }
`);

export const DailyJournalEntryConnected: React.FunctionComponent<
  DailyJournalEntryConnectedProps
> = ({ layerIndex }) => {
  const { layers } = useIpsumSearchParams<"journal">();

  const layer = layers?.[layerIndex];

  console.log(layers);

  if (!layer || layer.type !== "daily_journal") {
    throw new Error(`Layer at index ${layerIndex} does not exist in URL`);
  }

  const setDailyJournalLayerDay = useUrlAction(urlSetDailyJournalLayerDay);

  const entryDay =
    IpsumDay.fromString(layer.day, "url-format") ?? IpsumDay.today();

  const { data, loading, error } = useQuery(DailyJournalEntryQuery, {
    variables: {
      entryKey: entryDay.toString("entry-printed-date"),
      day: entryDay.toString("entry-printed-date"),
    },
  });

  const today = useToday(5000);

  const highlights = useMemo(
    () =>
      data.journalEntry.entry.highlights.map((highlight, index: number) => ({
        highlightId: highlight.id,
        highlightNumber: 0, // TODO
        hue: highlight.hue,
        arcNames: highlight.arcs.map((arc) => arc.name),
      })),
    [data.journalEntry.entry.highlights]
  );

  const comments = useMemo((): ComponentProps<
    typeof DailyJournalEntry
  >["comments"] => {
    if (!data.day.comments) return [];

    return data.day.comments.map((comment) => ({
      id: comment.id,
      day: entryDay,
      htmlString: comment.commentEntry.entry.htmlString,
      highlight: {
        id: comment.highlight.id,
        objectText: comment.commentEntry.entry.entryKey,
        hue: comment.highlight.hue,
        highlightNumber: 0, // TODO
        arcNames: comment.highlight.arcs.map((arc) => arc.name),
      },
      commentEntry: {
        highlights: comment.commentEntry.entry.highlights.map((highlight) => ({
          highlightId: highlight.id,
          hue: highlight.hue,
          arcNames: highlight.arcs.map((arc) => arc.name),
          highlightNumber: highlight.number,
        })),
        htmlString: comment.commentEntry.entry.htmlString,
      },
    }));
  }, [data.day.comments, entryDay]);

  if (loading || error) {
    return <div>Loading...</div>;
  }

  const entryDays = data.journalEntryDates.map((date: string) =>
    IpsumDay.fromString(date, "entry-printed-date")
  );

  const createEntry = (htmlString: string) => {
    return "entry_key";
  };

  const deleteEntry = (entryKey: string) => {};

  const updateEntry = ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => {
    return true;
  };

  const createHighlight = () => {
    return "highlight_id";
  };

  const onDaySelect = (day: IpsumDay) => {
    setDailyJournalLayerDay({ index: layerIndex, day });
  };

  const editable = today.equals(entryDay);

  return (
    <DailyJournalEntry
      headerProps={{
        day: entryDay,
        expanded: true,
      }}
      today={today}
      selectedDay={entryDay}
      entryDays={entryDays}
      htmlString={data.journalEntry.entry.htmlString}
      editable={editable}
      highlights={highlights}
      comments={comments}
      createEntry={createEntry}
      deleteEntry={deleteEntry}
      updateEntry={updateEntry}
      createHighlight={createHighlight}
      onDaySelect={onDaySelect}
    />
  );
};
