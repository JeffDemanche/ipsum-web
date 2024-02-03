import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";

export default function fixArcEntries(modifiedData: any) {
  Object.values(modifiedData.arcs).forEach((arc: any) => {
    if (
      !modifiedData.arcEntries[arc.arcEntry] ||
      !modifiedData.entries[modifiedData.arcEntries[arc.arcEntry].entry]
    ) {
      console.log("deleting arc entry field on arc", arc.name);
      delete modifiedData.arcs[arc.id].arcEntry;
    }
  });
}
