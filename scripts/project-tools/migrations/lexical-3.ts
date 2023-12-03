import { IpsumDateTime, IpsumDay } from "util/dates";

export default function createJournalEntries(data: any) {
  const entries = Object.keys(data.entries);

  entries.forEach((key) => {
    let entryKey: string = undefined;
    try {
      entryKey = IpsumDay.fromString(key, "stored-day").toString("stored-day");
    } catch (e) {
      return;
    }

    if (entryKey !== "Invalid DateTime") {
      data.journalEntries[entryKey] = {
        __typename: "JournalEntry",
        entryKey: entryKey,
        entry: entryKey,
      };
    }
  });
}
