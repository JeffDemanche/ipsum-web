import { DailyJournalURLLayer, URLLayer } from "util/url";

/**
 * Item which connects two layers, such as an arc highlight.
 */
interface DiptychMedian {
  /** Such as highlightId */
  connectionId?: string;
}

interface BaseDiptychLayer {
  diptychMedian: DiptychMedian;
  urlLayer: URLLayer;
}

export interface ConnectionOnlyLayer extends BaseDiptychLayer {
  type: "ConnectionOnly";
  index: number;
}

export interface DailyJournalLayer extends BaseDiptychLayer {
  type: "DailyJournal";
  index: number;
  startDate?: string;
  endDate?: string;
  urlLayer: DailyJournalURLLayer;
}

export interface ArcDetailLayer extends BaseDiptychLayer {
  type: "ArcDetail";
  index: number;
  arcId: string;
}

/**
 * A layer of the diptych, such as the journal view or an arc detail view.
 */
export type DiptychLayer =
  | ConnectionOnlyLayer
  | DailyJournalLayer
  | ArcDetailLayer;

export interface Diptych {
  layers: DiptychLayer[];
  layersBySide: { 0: DiptychLayer[]; 1: DiptychLayer[] };
  topLayerIndex: number;

  /**
   * Sets the layer at the given index, only if that index is between 0 and 1
   * greater than the top layer. If the top layer is just a connection, deal
   * with that case? Remove all layers above the index at which it was set to.
   * If layer is undefined, this can have the effect of simply closing a layer.
   */
  setLayer: (index: number, layer?: URLLayer) => void;

  /**
   * Sets the connectiondId for the layer at index. index must be between 1 and
   * 1 greater than the top layer (because layer 0 can’t have an incoming
   * connection). Set the layer at the specified index to just be the
   * connection, and remove all layers on top of it.
   */
  setConnection: (index: number, connectionId?: string) => void;

  setTopLayer: (layer: URLLayer) => void;

  setTopConnection: (connectionId: string) => void;
}
