import { Entry } from "../__generated__/graphql";
import { entries } from "../client";

export const createEntry = (entry: Entry) => {
  if (entries().find((e) => e.entryKey === entry.entryKey)) return;

  entries([...entries(), entry]);
};

export const updateEntry = (entry: Partial<Entry>) => {
  const entryIndex = entries().findIndex((e) => e.entryKey === entry.entryKey);
  if (entryIndex === -1) return;

  const newEntries = [...entries()];
  newEntries[entryIndex] = { ...newEntries[entryIndex], ...entry };
  entries(newEntries);
};

export const deleteEntry = (entryKey: string) => {
  const entryIndex = entries().findIndex((e) => e.entryKey === entryKey);
  if (entryIndex === -1) return;

  const newEntries = [...entries()];
  newEntries.splice(entryIndex, 1);
  entries(newEntries);
};
