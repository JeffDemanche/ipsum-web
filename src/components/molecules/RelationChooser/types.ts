import type { RelationSubject } from "util/apollo";

export interface ArcResult {
  id: string;
  hue: number;
  name: string;
}

export interface Relation {
  subjectType?: RelationSubject["__typename"];
  subjectId?: string;

  predicate: string;

  objectType: RelationSubject["__typename"];
  objectId: string;
}
