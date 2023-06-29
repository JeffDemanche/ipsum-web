import { UnhydratedType, vars } from "../client";
import { IpsumEntityTransformer } from "util/entities";
import { SelectionState } from "draft-js";
import { parseContentState, stringifyContentState } from "util/content-state";
import { autosave } from "../autosave";

export const createEntry = (
  entry: Omit<UnhydratedType["Entry"], "__typename">
): UnhydratedType["Entry"] => {
  if (vars.entries()[entry.entryKey]) return;

  const newEntry: UnhydratedType["Entry"] = { __typename: "Entry", ...entry };
  vars.entries({
    ...vars.entries(),
    [entry.entryKey]: newEntry,
  });
  autosave();
  return newEntry;
};

export const updateEntry = (
  entry: Partial<UnhydratedType["Entry"]>
): UnhydratedType["Entry"] | undefined => {
  if (!entry.entryKey)
    throw new Error("updateEntry: entry.entryKey is required");

  if (!vars.entries()[entry.entryKey]) return undefined;

  const newEntries = { ...vars.entries() };
  const newEntry = { ...newEntries[entry.entryKey], ...entry };
  newEntries[entry.entryKey] = newEntry;
  vars.entries(newEntries);
  autosave();
  return newEntry;
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
  const contentStateWithAssignment = new IpsumEntityTransformer(
    parseContentState(vars.entries()[entryKey].contentState)
  ).applyEntityData(selectionState, "textArcAssignments", {
    arcAssignmentId: highlightId,
  }).contentState;
  updateEntry({
    entryKey: entryKey,
    contentState: stringifyContentState(contentStateWithAssignment),
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
  const contentStateNoHighlight = new IpsumEntityTransformer(
    parseContentState(vars.entries()[entryKey].contentState)
  ).removeEntityData("textArcAssignments", null, (existingData) => {
    return existingData.arcAssignmentId !== highlightId;
  }).contentState;
  updateEntry({
    entryKey: entryKey,
    contentState: stringifyContentState(contentStateNoHighlight),
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
