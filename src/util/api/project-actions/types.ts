import { ProjectState } from "util/state/project";

interface APIActionContext {
  state: ProjectState;
}

export type APIFunction<T, U> = (
  args: T,
  context: APIActionContext
) => Promise<U>;
