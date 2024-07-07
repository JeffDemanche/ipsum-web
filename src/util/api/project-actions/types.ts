import { ProjectState } from "util/state";

interface APIActionContext {
  projectState: ProjectState;
}

export type APIFunction<T, U> = (args: T, context: APIActionContext) => U;
