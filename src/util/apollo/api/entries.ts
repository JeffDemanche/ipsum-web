import { Entry } from "../__generated__/graphql";
import { vars } from "../client";

export const createEntry = (entry: Entry) => {
  if (vars.entries()[entry.entryKey]) return;

  vars.entries({ ...vars.entries(), [entry.entryKey]: entry });
};

export const updateEntry = (entry: Partial<Entry>) => {
  if (!entry.entryKey)
    throw new Error("updateEntry: entry.entryKey is required");

  if (!vars.entries()[entry.entryKey]) return;

  const newEntries = { ...vars.entries() };
  newEntries[entry.entryKey] = { ...newEntries[entry.entryKey], ...entry };
  vars.entries(newEntries);
};

export const deleteEntry = (entryKey: string) => {
  if (!vars.entries()[entryKey]) return;

  const newEntries = { ...vars.entries() };
  delete newEntries[entryKey];
  vars.entries(newEntries);
};
