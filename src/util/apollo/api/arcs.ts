import { nextHue } from "util/colors";
import { v4 as uuidv4 } from "uuid";
import { UnhydratedType, arcs, journalMetadata } from "../client";

export const createArc = ({ name }: { name: string }) => {
  const arcId = uuidv4();
  const color = nextHue(journalMetadata().lastArcHue ?? 0);

  journalMetadata({ ...journalMetadata(), lastArcHue: color });

  arcs([...arcs(), { id: arcId, name, color }]);
};

export const updateArc = (arc: Partial<UnhydratedType["Arc"]>) => {
  if (!arc.id) throw new Error("updateArc: arc.id is required");

  if (!arcs().find((a) => a.id === arc.id))
    throw new Error(`updateArc: arc not found: ${arc.id}`);

  const arcIndex = arcs().findIndex((a) => a.id === arc.id);

  const newArcs = [...arcs()];
  newArcs[arcIndex] = { ...newArcs[arcIndex], ...arc };
  arcs(newArcs);
};

export const deleteArc = (id: string) => {
  const arcIndex = arcs().findIndex((a) => a.id === id);
  if (arcIndex === -1) return;

  const newArcs = [...arcs()];
  newArcs.splice(arcIndex, 1);
  arcs(newArcs);
};
