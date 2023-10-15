import { UnhydratedType, vars } from "../client";
import { IpsumEntityTransformer } from "util/entities";
import { SelectionState } from "draft-js";
import { parseContentState, stringifyContentState } from "util/content-state";
import { autosave } from "../autosave";
import { IpsumDateTime, IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { EntryType } from "../__generated__/graphql";
import { upsertDayForToday } from "./day";

export const createEntry = (entry: {
  entryKey: string;
  stringifiedContentState: string;
  entryType: EntryType;
}): UnhydratedType["Entry"] => {
  if (vars.entries()[entry.entryKey]) return;

  const newEntry: UnhydratedType["Entry"] = {
    __typename: "Entry",
    entryKey: entry.entryKey,
    trackedContentState: IpsumTimeMachine.create(
      entry.stringifiedContentState
    ).toString(),
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

  upsertDayForToday();
  autosave();
  return newEntry;
};

export const updateEntry = (entry: {
  entryKey: string;
  stringifiedContentState?: string;
  history?: UnhydratedType["History"];
}): UnhydratedType["Entry"] | undefined => {
  if (!entry.entryKey)
    throw new Error("updateEntry: entry.entryKey is required");

  if (!vars.entries()[entry.entryKey]) return undefined;

  const oldEntry = vars.entries()[entry.entryKey];
  const newEntry: Partial<UnhydratedType["Entry"]> = {};

  const today = IpsumDateTime.today();

  if (entry.stringifiedContentState) {
    // Make nondestructive changes to the trackedContentState
    newEntry.trackedContentState = IpsumTimeMachine.fromString(
      oldEntry.trackedContentState
    )
      .setValueAtDate(today.dateTime.toJSDate(), entry.stringifiedContentState)
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

export const assignHighlightToEntry = ({
  entryKey,
  highlightId,
  selectionState,
}: {
  entryKey: string;
  highlightId: string;
  selectionState: SelectionState;
}) => {
  const latestContentState = parseContentState(
    IpsumTimeMachine.fromString(vars.entries()[entryKey].trackedContentState)
      .currentValue
  );

  const contentStateWithAssignment = new IpsumEntityTransformer(
    latestContentState
  ).applyEntityData(selectionState, "textArcAssignments", {
    arcAssignmentId: highlightId,
  }).contentState;
  updateEntry({
    entryKey: entryKey,
    stringifiedContentState: stringifyContentState(contentStateWithAssignment),
  });
  autosave();
};
export const removeHighlightFromEntry = ({
  entryKey,
  highlightId,
}: {
  entryKey: string;
  highlightId: string;
}) => {
  const latestContentState = parseContentState(
    IpsumTimeMachine.fromString(vars.entries()[entryKey].trackedContentState)
      .currentValue
  );

  const contentStateNoHighlight = new IpsumEntityTransformer(
    latestContentState
  ).removeEntityData("textArcAssignments", null, (existingData) => {
    return existingData.arcAssignmentId !== highlightId;
  }).contentState;
  updateEntry({
    entryKey: entryKey,
    stringifiedContentState: stringifyContentState(contentStateNoHighlight),
  });
  autosave();
};

export const deleteEntry = (entryKey: string) => {
  if (!vars.entries()[entryKey]) return;

  const newEntries = { ...vars.entries() };
  delete newEntries[entryKey];
  vars.entries(newEntries);
  autosave();
};
