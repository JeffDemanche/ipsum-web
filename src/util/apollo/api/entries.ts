import { Entry } from "../__generated__/graphql";
import { UnhydratedType, vars } from "../client";
import { IpsumEntityTransformer } from "util/entities";
import { SelectionState } from "draft-js";
import { parseContentState, stringifyContentState } from "util/content-state";

export const createEntry = (entry: Entry): UnhydratedType["Entry"] => {
  if (vars.entries()[entry.entryKey]) return;

  vars.entries({ ...vars.entries(), [entry.entryKey]: entry });
  return entry;
};

export const updateEntry = (entry: Partial<Entry>) => {
  if (!entry.entryKey)
    throw new Error("updateEntry: entry.entryKey is required");

  if (!vars.entries()[entry.entryKey]) return;

  const newEntries = { ...vars.entries() };
  newEntries[entry.entryKey] = { ...newEntries[entry.entryKey], ...entry };
  vars.entries(newEntries);
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
};

export const deleteEntry = (entryKey: string) => {
  if (!vars.entries()[entryKey]) return;

  const newEntries = { ...vars.entries() };
  delete newEntries[entryKey];
  vars.entries(newEntries);
};
