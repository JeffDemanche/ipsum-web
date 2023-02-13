import { Document } from "state/in-memory";

export interface ArcDetailContextValue {
  arc: Document<"arc">;
  assignment: Document<"arc_assignment">;
}
