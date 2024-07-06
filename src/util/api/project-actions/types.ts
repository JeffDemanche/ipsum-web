import { ProjectState } from "util/state/project";

interface APIActionContext {
  projectState: ProjectState;
}

export type APIFunction<T, U> = (args: T, context: APIActionContext) => U;
