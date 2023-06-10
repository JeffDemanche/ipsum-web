export interface HighlightSearchCriteria {
  predicate?: string;
  arc: string;
}

export interface HighlightSearch {
  criteria: HighlightSearchCriteria[];
}
