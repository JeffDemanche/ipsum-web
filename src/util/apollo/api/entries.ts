import { IpsumDateTime, IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { autosave } from "util/serializer";

import { EntryType } from "../__generated__/graphql";
import { UnhydratedType, vars } from "../client";
import { deleteDayIfEmpty, upsertDay, upsertDayForToday } from "./day";

export const createEntry = (entry: {
  dayCreated?: IpsumDay;
  entryKey: string;
  htmlString: string;
  entryType: EntryType;
}): UnhydratedType["Entry"] => {
  if (vars.entries()[entry.entryKey]) return;

  const newEntry: UnhydratedType["Entry"] = {
    __typename: "Entry",
    entryKey: entry.entryKey,
    trackedHTMLString: IpsumTimeMachine.create(entry.htmlString).toString(),
    history: {
      __typename: "History",
      dateCreated: IpsumDay.today().toString("iso"),
    },
    entryType: entry.entryType,
  };
  vars.entries({
    ...vars.entries(),
    [entry.entryKey]: newEntry,
  });

  upsertDay({
    day:
      entry.dayCreated?.toString("stored-day") ??
      IpsumDay.today().toString("stored-day"),
  });
  autosave();
  return newEntry;
};

export const updateEntry = (entry: {
  entryKey: string;
  htmlString?: string;
  history?: UnhydratedType["History"];
}): UnhydratedType["Entry"] | undefined => {
  if (!entry.entryKey)
    throw new Error("updateEntry: entry.entryKey is required");

  if (!vars.entries()[entry.entryKey]) return undefined;

  const oldEntry = vars.entries()[entry.entryKey];
  const newEntry: Partial<UnhydratedType["Entry"]> = {};

  const today = IpsumDateTime.today();

  if (entry.htmlString) {
    // Make nondestructive changes to the trackedHTMLString
    newEntry.trackedHTMLString = IpsumTimeMachine.fromString(
      oldEntry.trackedHTMLString
    )
      .setValueAtDate(today.dateTime.toJSDate(), entry.htmlString)
      .toString();
  }
  if (entry.history) {
    newEntry.history = entry.history;
  }

  const entryUpdate = { ...oldEntry, ...newEntry };

  const entriesCopy = { ...vars.entries() };
  entriesCopy[entry.entryKey] = entryUpdate;
  vars.entries(entriesCopy);

  upsertDayForToday();
  autosave();
  return entryUpdate;
};

export const deleteEntry = (entryKey: string) => {
  if (!vars.entries()[entryKey]) return;

  const newEntries = { ...vars.entries() };
  delete newEntries[entryKey];
  vars.entries(newEntries);

  const newDays = { ...vars.days() };
  Object.values(newDays).forEach((day) => {
    if (day.journalEntry === entryKey) delete day.journalEntry;
    if (day.changedArcEntries.includes(entryKey))
      day.changedArcEntries = day.changedArcEntries.filter(
        (e) => e !== entryKey
      );
  });
  vars.days(newDays);
  deleteDayIfEmpty(IpsumDay.fromString(entryKey, "stored-day").toString());

  autosave();
};
