import { nextHue } from "util/colors";
import { v4 as uuidv4 } from "uuid";
import { UnhydratedType, vars } from "../client";

export const createArc = ({ name }: { name: string }) => {
  const arcId = uuidv4();
  const color = nextHue(vars.journalMetadata().lastArcHue ?? 0);

  vars.journalMetadata({ ...vars.journalMetadata(), lastArcHue: color });

  vars.arcs({ ...vars.arcs(), [arcId]: { id: arcId, name, color } });
};

export const updateArc = (arc: Partial<UnhydratedType["Arc"]>) => {
  if (!arc.id) throw new Error("updateArc: arc.id is required");

  if (!vars.arcs()[arc.id]) return;

  const newArcs = { ...vars.arcs() };
  newArcs[arc.id] = { ...newArcs[arc.id], ...arc };
  vars.arcs(newArcs);
};

export const deleteArc = (id: string) => {
  if (!vars.arcs()[id]) return;

  const newArcs = { ...vars.arcs() };
  delete newArcs[id];
  vars.arcs(newArcs);
};
