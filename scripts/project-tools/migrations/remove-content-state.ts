export default function removeContentState(data: any) {
  const entries = Object.keys(data.entries);

  entries.forEach((key: any) => {
    const entry = data.entries[key];
    delete entry.trackedContentState;
    entries[key] = entry;
  });
}
