import type { APIFunction } from "../types";

export const deleteCommentEntry: APIFunction<
  {
    entryKey: string;
  },
  boolean
> = (args, context) => {
  const { projectState } = context;

  projectState.collection("entries").delete(args.entryKey);

  return projectState.collection("commentEntries").delete(args.entryKey);
};
