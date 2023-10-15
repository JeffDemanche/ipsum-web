import { IpsumDay } from "util/dates";

export default function fix(modifiedData: any) {
  const entriesCopy = { ...modifiedData.entries };
  Object.entries(entriesCopy).forEach(([entryKey, entry]: [string, any]) => {
    if (entry.history.dateCreated === null) {
      entriesCopy[entryKey].history.dateCreated =
        IpsumDay.today().toString("iso");
    }
  });
  modifiedData.entries = entriesCopy;
}
