import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";

export default function fixArcEntries(modifiedData: any) {
  Object.values(modifiedData.arcs).forEach((arc: any) => {
    if (!modifiedData.arcEntries[arc.arcEntry]) {
      console.log("missing arc entry", arc.name);
      modifiedData.entries[arc.arcEntry] = {
        __typename: "Entry",
        entryKey: arc.arcEntry,
        trackedHTMLString: IpsumTimeMachine.create("").toString(),
        entryType: "ARC",
        history: {
          __typename: "History",
          dateCreated: IpsumDay.today().toString("iso"),
        },
      };
      modifiedData.arcEntries[arc.arcEntry] = {
        __typename: "ArcEntry",
        entry: arc.arcEntry,
        arc: arc.id,
      };
    }
  });
}
