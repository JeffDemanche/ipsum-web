import { IpsumTimeMachine } from "util/diff";

export default function lexical(modifiedData: any) {
  const newEntries: { [key: string]: any } = {};

  Object.entries(modifiedData.entries).forEach(
    ([key, value]: [string, any]) => {
      const newEntry = { ...value };
      newEntry.trackedHTMLString = IpsumTimeMachine.create("").toString();
      newEntries[key] = newEntry;
    }
  );

  modifiedData.entries = newEntries;
}
