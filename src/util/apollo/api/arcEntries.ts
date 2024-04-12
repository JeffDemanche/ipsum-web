import { v4 as uuidv4 } from "uuid";

import { EntryType } from "../__generated__/graphql";
import { autosave } from "../autosave";
import { UnhydratedType, vars } from "../client";
import { createEntry } from "./entries";

export const createArcEntry = ({
  arcId,
  arcName,
  htmlString = "",
}: {
  arcId: string;
  arcName: string;
  htmlString?: string;
}): UnhydratedType["ArcEntry"] => {
  const arcEntryKey = `arc-entry:${arcName}:${uuidv4()}`;

  createEntry({
    entryKey: arcEntryKey,
    htmlString: htmlString,
    entryType: EntryType.Arc,
  });

  const arcEntry: UnhydratedType["ArcEntry"] = {
    __typename: "ArcEntry",
    entry: arcEntryKey,
    arc: arcId,
  };

  vars.arcEntries({ ...vars.arcEntries(), [arcEntryKey]: arcEntry });

  autosave();

  return arcEntry;
};

export const deleteArcEntry = (entryKey: string) => {
  if (!vars.arcEntries()[entryKey])
    throw new Error(`deleteArcEntry: arc entryKey ${entryKey} not found`);

  const newArcEntries = { ...vars.arcEntries() };
  delete newArcEntries[entryKey];
  vars.arcEntries(newArcEntries);

  const newEntries = { ...vars.entries() };
  delete newEntries[entryKey];
  vars.entries(newEntries);

  const newArcs = { ...vars.arcs() };
  Object.values(newArcs).forEach((arc) => {
    if (arc.arcEntry === entryKey) {
      delete arc.arcEntry;
    }
  });

  autosave();
};
