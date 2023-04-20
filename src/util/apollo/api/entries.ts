import { Entry } from "../__generated__/graphql";
import { vars } from "../client";

export const createEntry = (entry: Entry) => {
  if (vars.entries().find((e) => e.entryKey === entry.entryKey)) return;

  vars.entries([...vars.entries(), entry]);
};

export const updateEntry = (entry: Partial<Entry>) => {
  const entryIndex = vars
    .entries()
    .findIndex((e) => e.entryKey === entry.entryKey);
  if (entryIndex === -1) return;

  const newEntries = [...vars.entries()];
  newEntries[entryIndex] = { ...newEntries[entryIndex], ...entry };
  vars.entries(newEntries);
};

export const deleteEntry = (entryKey: string) => {
  const entryIndex = vars.entries().findIndex((e) => e.entryKey === entryKey);
  if (entryIndex === -1) return;

  const newEntries = [...vars.entries()];
  newEntries.splice(entryIndex, 1);
  vars.entries(newEntries);
};
