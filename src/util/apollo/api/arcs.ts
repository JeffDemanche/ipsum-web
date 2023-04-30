import { nextHue } from "util/colors";
import { v4 as uuidv4 } from "uuid";
import { autosave } from "../autosave";
import { UnhydratedType, vars } from "../client";

export const createArc = ({
  name,
}: {
  name: string;
}): UnhydratedType["Arc"] => {
  const arcId = uuidv4();
  const color = nextHue(vars.journalMetadata().lastArcHue ?? 0);

  vars.journalMetadata({ ...vars.journalMetadata(), lastArcHue: color });

  const arc: UnhydratedType["Arc"] = {
    __typename: "Arc",
    id: arcId,
    name,
    color,
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

  const newArcs = { ...vars.arcs() };
  delete newArcs[id];
  vars.arcs(newArcs);
  autosave();
};
