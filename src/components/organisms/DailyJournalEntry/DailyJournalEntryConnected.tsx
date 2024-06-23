import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import { gql } from "util/apollo";
import { IpsumDay, useToday } from "util/dates";

import { DailyJournalEntry } from "./DailyJournalEntry";

interface DailyJournalEntryConnectedProps {
  entryDay: IpsumDay;
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
> = ({ entryDay }) => {
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

  console.log(data.day);

  const comments = useMemo(() => {
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

  const onDaySelect = (day: IpsumDay) => {};

  const editable = today.equals(entryDay);

  return (
    <DailyJournalEntry
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
