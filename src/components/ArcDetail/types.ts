import { Document } from "state/in-memory";

export interface ArcDetailContextValue {
  arc: Document<"arc">;
  incomingHighlight: Document<"highlight">;
}
