import { UnhydratedType, vars } from "../client";
import { v4 as uuidv4 } from "uuid";
import { createEntry } from "./entries";
import { ContentState } from "draft-js";
import { stringifyContentState } from "util/content-state";
import { EntryType } from "../__generated__/graphql";

export const createArcEntry = ({
  arcId,
  arcName,
}: {
  arcId: string;
  arcName: string;
}): UnhydratedType["ArcEntry"] => {
  const arcEntryKey = `arc-entry:${arcName}:${uuidv4()}`;

  createEntry({
    entryKey: arcEntryKey,
    stringifiedContentState: stringifyContentState(
      ContentState.createFromText("")
    ),
    entryType: EntryType.Arc,
  });

  const arcEntry: UnhydratedType["ArcEntry"] = {
    __typename: "ArcEntry",
    entry: arcEntryKey,
    arc: arcId,
  };

  vars.arcEntries({ ...vars.arcEntries(), [arcEntryKey]: arcEntry });

  return arcEntry;
};

// export const updateArcEntry = ({
//   entryKey,
//   contentState,
// }: {
//   entryKey: string;
//   contentState: string;
// }): UnhydratedType["ArcEntry"] | undefined => {
//   if (!vars.arcEntries()[entryKey]) return undefined;

//   const oldTrackedContentState = IpsumTimeMachine.fromString(
//     vars.arcEntries()[entryKey].entry.
//   );
//   const newTrackedContentState = oldTrackedContentState.setValueAtDate(
//     new Date(),
//     contentState
//   );

//   const newArcEntries = { ...vars.arcEntries() };
//   const newArcEntry = {
//     ...newArcEntries[entryKey],
//     trackedContentState: newTrackedContentState.toString(),
//   };
//   newArcEntries[entryKey] = newArcEntry;
//   vars.arcEntries(newArcEntries);
//   autosave();
//   return newArcEntry;
// };

export const deleteArcEntry = (entryKey: string) => {
  if (!vars.arcEntries()[entryKey])
    throw new Error(`deleteArcEntry: arc entryKey ${entryKey} not found`);

  const newArcEntries = { ...vars.arcEntries() };
  delete newArcEntries[entryKey];
  vars.arcEntries(newArcEntries);

  const newEntries = { ...vars.entries() };
  delete newEntries[entryKey];
  vars.entries(newEntries);
};
