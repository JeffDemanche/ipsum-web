/**
 * Item which connects two layers, such as an arc highlight.
 */
interface Connection {}

interface DailyJournalLayer {
  type: "DailyJournal";
}

interface ArcDetailLayer {
  type: "ArcDetail";
}

/**
 * A layer of the diptych, such as the journal view or an arc detail view.
 */
type Layer = { connectionFrom?: Connection } & (
  | DailyJournalLayer
  | ArcDetailLayer
);

interface Diptych {
  layers: Layer[];
  layersBySide: { 0: Layer[]; 1: Layer[] };
}
