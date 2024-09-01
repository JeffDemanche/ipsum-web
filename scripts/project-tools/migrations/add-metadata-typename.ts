export default function addMetadataTypename(data: any) {
  const journalMetadata = data.journalMetadata;
  journalMetadata.__typename = "JournalMetadata";
}
