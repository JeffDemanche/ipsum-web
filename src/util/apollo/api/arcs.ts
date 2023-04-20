import { nextHue } from "util/colors";
import { v4 as uuidv4 } from "uuid";
import { UnhydratedType, vars } from "../client";

export const createArc = ({ name }: { name: string }) => {
  const arcId = uuidv4();
  const color = nextHue(vars.journalMetadata().lastArcHue ?? 0);

  vars.journalMetadata({ ...vars.journalMetadata(), lastArcHue: color });

  vars.arcs([...vars.arcs(), { id: arcId, name, color }]);
};

export const updateArc = (arc: Partial<UnhydratedType["Arc"]>) => {
  if (!arc.id) throw new Error("updateArc: arc.id is required");

  if (!vars.arcs().find((a) => a.id === arc.id))
    throw new Error(`updateArc: arc not found: ${arc.id}`);

  const arcIndex = vars.arcs().findIndex((a) => a.id === arc.id);

  const newArcs = [...vars.arcs()];
  newArcs[arcIndex] = { ...newArcs[arcIndex], ...arc };
  vars.arcs(newArcs);
};

export const deleteArc = (id: string) => {
  const arcIndex = vars.arcs().findIndex((a) => a.id === id);
  if (arcIndex === -1) return;

  const newArcs = [...vars.arcs()];
  newArcs.splice(arcIndex, 1);
  vars.arcs(newArcs);
};
