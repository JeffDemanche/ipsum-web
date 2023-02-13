import { URLLayer } from "util/url";

/**
 * Item which connects two layers, such as an arc highlight.
 */
interface Connection {}

interface DailyJournalLayer {
  type: "DailyJournal";
}

interface ArcDetailLayer {
  type: "ArcDetail";
  assignmentId: string;
  arcId: string;
}

/**
 * A layer of the diptych, such as the journal view or an arc detail view.
 */
export type DiptychLayer = { connectionFrom?: Connection } & (
  | DailyJournalLayer
  | ArcDetailLayer
);

export interface Diptych {
  layers: DiptychLayer[];
  layersBySide: { 0: DiptychLayer[]; 1: DiptychLayer[] };
  pushLayer: (layer: URLLayer) => void;
  setFirstLayer: (layer: URLLayer) => void;
  closeLayer: (index: number) => void;
}
