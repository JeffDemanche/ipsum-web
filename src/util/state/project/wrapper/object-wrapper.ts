import { ProjectState } from "../project-state";

export class ObjectWrapper {
  private _projectState: ProjectState;

  constructor(projectState: ProjectState) {
    this._projectState = projectState;
  }

  get projectState() {
    return this._projectState;
  }
}
