import { UnhydratedType, vars } from "../client";
import { v4 as uuidv4 } from "uuid";
import { IpsumTimeMachine } from "util/diff";

export const createArcEntry = ({
  arcId,
  arcName,
}: {
  arcId: string;
  arcName: string;
}): UnhydratedType["ArcEntry"] => {
  const arcEntryKey = `arc-entry:${arcName}:${uuidv4()}`;

  const arcEntry: UnhydratedType["ArcEntry"] = {
    __typename: "ArcEntry",
    entryKey: arcEntryKey,
    arcId,
    trackedContentState: new IpsumTimeMachine().toString(),
  };

  vars.arcEntries({ ...vars.arcEntries(), [arcEntryKey]: arcEntry });

  return arcEntry;
};

export const updateArcEntry = ({
  entryKey,
  contentState,
}: {
  entryKey: string;
  contentState: string;
}) => {
  if (!vars.arcEntries()[entryKey])
    throw new Error(`updateArcEntry: arc entryKey ${entryKey} not found`);

  const oldTrackedContentState = IpsumTimeMachine.fromString(
    vars.arcEntries()[entryKey].trackedContentState
  );
  const newTrackedContentState = oldTrackedContentState.setValueAtDate(
    new Date(),
    contentState
  );

  const newArcEntries = { ...vars.arcEntries() };
  newArcEntries[entryKey] = {
    ...newArcEntries[entryKey],
    trackedContentState: newTrackedContentState.toString(),
  };
  vars.arcEntries(newArcEntries);
};

export const deleteArcEntry = (entryKey: string) => {
  if (!vars.arcEntries()[entryKey])
    throw new Error(`deleteArcEntry: arc entryKey ${entryKey} not found`);

  const newArcEntries = { ...vars.arcEntries() };
  delete newArcEntries[entryKey];
  vars.arcEntries(newArcEntries);
};
