import { ArcDetailContextQuery } from "util/apollo";

export interface ArcDetailContextValue {
  arcId: string;
  arc: ArcDetailContextQuery["arc"];
  incomingHighlightId: string;
}
