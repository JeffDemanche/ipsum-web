import { nextHue } from "util/colors";
import { v4 as uuidv4 } from "uuid";

import { autosave } from "../autosave";
import { UnhydratedType, vars } from "../client";
import { createArcEntry, deleteArcEntry } from "./arcEntries";
import { initializeHistory } from "./history";

export const createArc = ({
  name,
}: {
  name: string;
}): UnhydratedType["Arc"] => {
  const arcId = uuidv4();
  const color = nextHue(vars.journalMetadata().lastArcHue ?? 0);

  vars.journalMetadata({ ...vars.journalMetadata(), lastArcHue: color });

  const arcEntry = createArcEntry({ arcId, arcName: name });

  const arc: UnhydratedType["Arc"] = {
    __typename: "Arc",
    id: arcId,
    name,
    color,
    arcEntry: arcEntry.entry,
    history: initializeHistory(),
    incomingRelations: [],
    outgoingRelations: [],
  };
  vars.arcs({ ...vars.arcs(), [arcId]: arc });
  autosave();
  return arc;
};

export const updateArc = (arc: Partial<UnhydratedType["Arc"]>) => {
  if (!arc.id) throw new Error("updateArc: arc.id is required");

  if (!vars.arcs()[arc.id]) return;

  const newArcs = { ...vars.arcs() };
  newArcs[arc.id] = { ...newArcs[arc.id], ...arc };
  vars.arcs(newArcs);
  autosave();
};

export const deleteArc = (id: string) => {
  if (!vars.arcs()[id]) return;

  const arcEntryKey = vars.arcs()[id].arcEntry;
  deleteArcEntry(arcEntryKey);

  const newRelations = { ...vars.relations() };
  vars.arcs()[id].outgoingRelations.forEach((relation) => {
    delete newRelations[relation];
  });
  vars.arcs()[id].incomingRelations.forEach((relation) => {
    delete newRelations[relation];
  });
  vars.relations(newRelations);

  const newArcs = { ...vars.arcs() };
  delete newArcs[id];
  vars.arcs(newArcs);

  autosave();
};
