export default function backfillDayObject(data: any) {
  const djEntriesWithNoDays = Object.values(data.journalEntries).filter(
    (entry: any) =>
      Object.values(data.days).every((day: any) => day.day !== entry.entryKey)
  );

  djEntriesWithNoDays.forEach((entry: any) => {
    const day = {
      __typename: "Day",
      day: entry.entryKey,
      journalEntry: entry.id,
      comments: [] as any,
      changedArcEntries: [] as any,
      ratedHighlights: [] as any,
    };
    console.log(`Backfilling day object for ${entry.entryKey}`);
    data.days[entry.entryKey] = day;
  });
}
