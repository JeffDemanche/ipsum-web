export interface ArcDetailContextValue {
  arcId: string;
  arc: {
    id: string;
    name: string;
    color: number;
  };
  incomingHighlightId: string;
}
