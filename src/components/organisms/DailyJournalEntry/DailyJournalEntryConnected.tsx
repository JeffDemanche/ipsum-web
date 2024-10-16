import { useQuery } from "@apollo/client";
import React, { ComponentProps, useMemo } from "react";
import {
  apiCreateHighlight,
  apiCreateJournalEntry,
  apiDeleteHighlight,
  apiDeleteJournalEntry,
  apiUpdateJournalEntry,
  urlInsertLayer,
  urlRemoveLayer,
  urlSetLayerExpanded,
  useApiAction,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay, useToday } from "util/dates";
import { useIpsumSearchParams } from "util/state";

import { DailyJournalEntry } from "./DailyJournalEntry";

interface DailyJournalEntryConnectedProps {
  layerIndex: number;
  day: IpsumDay;
  onDayChange: (day: IpsumDay) => void;
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
          number
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
> = ({ layerIndex, day, onDayChange }) => {
  const entryDay = day ?? IpsumDay.today();

  const { data, loading, error } = useQuery(DailyJournalEntryQuery, {
    variables: {
      entryKey: entryDay.toString("entry-printed-date"),
      day: entryDay.toString("entry-printed-date"),
    },
  });

  const isNew = !data.journalEntry?.entry;

  const today = useToday(5000);

  const highlights = useMemo(
    () =>
      isNew
        ? []
        : data.journalEntry.entry.highlights.map(
            (highlight, index: number) => ({
              highlightId: highlight.id,
              highlightNumber: highlight.number, // TODO
              hue: highlight.hue,
              arcNames: highlight.arcs.map((arc) => arc.name),
            })
          ),
    [data.journalEntry?.entry?.highlights, isNew]
  );

  const comments = useMemo((): ComponentProps<
    typeof DailyJournalEntry
  >["comments"] => {
    if (isNew || !data.day.comments) return [];

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
  }, [data.day?.comments, entryDay, isNew]);

  const htmlString = isNew ? "" : data.journalEntry.entry.htmlString;

  const { layers } = useIpsumSearchParams<"journal">();

  const layerExpanded = layers?.[layerIndex]?.expanded === "true";

  const [createJournalEntry] = useApiAction(apiCreateJournalEntry);

  const [updateJournalEntry] = useApiAction(apiUpdateJournalEntry);

  const [deleteJournalEntry] = useApiAction(apiDeleteJournalEntry);

  const [createHighlight] = useApiAction(apiCreateHighlight);

  const [deleteHighlight] = useApiAction(apiDeleteHighlight);

  const setLayerExpanded = useUrlAction(urlSetLayerExpanded);

  const insertLayer = useUrlAction(urlInsertLayer);

  const removeLayer = useUrlAction(urlRemoveLayer);

  const onSetExpanded = (expanded: boolean) => {
    setLayerExpanded({ index: layerIndex, expanded });
  };

  if (loading || error) {
    return <div>Loading...</div>;
  }

  const entryDays = data.journalEntryDates.map((date: string) =>
    IpsumDay.fromString(date, "entry-printed-date")
  );

  const createEntry = (htmlString: string) => {
    return createJournalEntry({
      entryKey: day.toString("stored-day"),
      htmlString,
      dayCreated: today,
    }).entryKey;
  };

  const deleteEntry = (entryKey: string) => {
    deleteJournalEntry({ entryKey });
  };

  const updateEntry = ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => {
    return updateJournalEntry({ entryKey, htmlString });
  };

  const onCreateHighlight = () => {
    const { id } = createHighlight({
      entryKey: day.toString("stored-day"),
      dayCreated: today,
    });
    return id;
  };

  const onDeleteHighlight = (highlightId: string) => {
    deleteHighlight({ id: highlightId });
  };

  const yesterday = today.add(-1);

  const editable = today.equals(entryDay) || yesterday.equals(entryDay);

  const openHighlightLayer = (highlightId: string) => {
    insertLayer({
      layer: {
        type: "highlight_detail",
        highlightId,
        expanded: "true",
      },
    });
  };

  return (
    <DailyJournalEntry
      entryKey={day.toString("stored-day")}
      headerProps={{
        day: entryDay,
        expanded: layerExpanded,
        onExpand: () => {
          onSetExpanded(true);
        },
        onCollapse: () => {
          onSetExpanded(false);
        },
        onClose: () => {
          removeLayer({ index: layerIndex });
        },
      }}
      today={today}
      selectedDay={entryDay}
      entryDays={entryDays}
      htmlString={htmlString}
      editable={editable}
      highlights={highlights}
      comments={comments}
      createEntry={createEntry}
      deleteEntry={deleteEntry}
      updateEntry={updateEntry}
      createHighlight={onCreateHighlight}
      deleteHighlight={onDeleteHighlight}
      onDaySelect={onDayChange}
      onHighlightClick={openHighlightLayer}
    />
  );
};
