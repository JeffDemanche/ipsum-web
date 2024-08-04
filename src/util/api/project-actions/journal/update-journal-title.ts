import { APIFunction } from "../types";

export const updateJournalTitle: APIFunction<{ title: string }, string> = (
  args,
  context
) => {
  const { projectState } = context;

  projectState.set("journalTitle", args.title);

  return args.title;
};
