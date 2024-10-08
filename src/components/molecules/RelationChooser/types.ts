export interface ArcResult {
  id: string;
  hue: number;
  name: string;
}

export interface Relation {
  predicate: string;
  arcId: string;
}
