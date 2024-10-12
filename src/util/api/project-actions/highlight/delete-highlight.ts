import { APIFunction } from "../types";

export const deleteHighlight: APIFunction<{ id: string }, boolean> = (
  args,
  context
) => {
  const { projectState } = context;

  return projectState.collection("highlights").delete(args.id);

  // TODO Remove highlight formatting from entries.
};
