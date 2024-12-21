import { IpsumDay } from "util/dates";

import { updateDay } from "../day/update-day";
import { APIFunction } from "../types";

export const deleteComment: APIFunction<{ id: string }, boolean> = (
  args,
  context
) => {
  const { projectState } = context;

  if (!projectState.collection("comments").has(args.id)) {
    return false;
  }

  const comment = projectState.collection("comments").get(args.id);

  projectState.collection("commentEntries").delete(comment.commentEntry);

  projectState.collection("comments").delete(args.id);

  updateDay(
    {
      day: IpsumDay.fromString(comment.history.dateCreated, "iso"),
      comments: (comments) => comments.filter((c) => c !== args.id),
    },
    context
  );

  return true;
};
