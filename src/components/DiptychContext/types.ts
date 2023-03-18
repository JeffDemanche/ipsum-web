import { URLLayer } from "util/url";

/**
 * Item which connects two layers, such as an arc highlight.
 */
interface DiptychMedian {
  /** Such as highlightId */
  connectionId: string;
}

interface DailyJournalLayer {
  type: "DailyJournal";
}

interface ArcDetailLayer {
  type: "ArcDetail";
  arcId: string;
}

/**
 * A layer of the diptych, such as the journal view or an arc detail view.
 */
export type DiptychLayer = (DailyJournalLayer | ArcDetailLayer) & {
  diptychMedian?: DiptychMedian;
};

export interface Diptych {
  layers: DiptychLayer[];
  layersBySide: { 0: DiptychLayer[]; 1: DiptychLayer[] };
  topLayerIndex: number;

  pushLayer: (layer: URLLayer) => void;
  setFirstLayer: (layer: URLLayer) => void;
  closeLayer: (index: number, keepConnection?: boolean) => void;
  openArcDetail: (index: number, arcId: string) => void;
}
