import type { InMemoryHighlight } from "util/state";

import type { APIFunction } from "../types";

export const updateHighlight: APIFunction<
  {
    id: string;
  },
  InMemoryHighlight
> = (args, contect) => {
  const { projectState } = contect;

  if (!projectState.collection("highlights").has(args.id)) {
    throw new Error(
      `No highlight with id ${args.id} exists in the project state`
    );
  }

  return projectState.collection("highlights").get(args.id);
};
