export { client } from "./client";
export * from "./__generated__";
export * from "./__generated__/graphql";
export * from "./api/arcs";
export * from "./api/journalEntries";
export {
  updateEntry,
  assignHighlightToEntry,
  removeHighlightFromEntry,
} from "./api/entries";
export * from "./api/highlights";
export * from "./api/journalTitle";
export * from "./api/relations";
export {
  ApolloSerializationProvider,
  ApolloSerializationContext,
} from "./ApolloSerializationContext";
export { EntryType } from "./__generated__/graphql";
