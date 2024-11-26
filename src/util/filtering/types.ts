import { RelationChooserConnectedProps } from "components/hooks/use-relation-chooser-connected";
import { DatePickerDayData } from "components/molecules/DatePicker";
import { IToken } from "ebnf";
import { FunctionComponent } from "react";
import { IpsumDay } from "util/dates";
import { IpsumSRSCard } from "util/repetition";

import { FilterTreeAction } from "./components/filter-tree-actions";
import { IpsumFilteringProgramV1 } from "./v1-filtering-program";

export interface FilterableOutgoingRelation {
  predicate: string;
  objectType: "Arc";
  objectId: string;
  objectName: string;
}

export interface FilterableHighlight {
  type: "highlight";
  id: string;
  day: IpsumDay;
  outgoingRelations: FilterableOutgoingRelation[];
  srsCard: IpsumSRSCard | null;
}

export interface FilterableArc {
  type: "arc";
  id: string;
  day: IpsumDay;
  outgoingRelations: FilterableOutgoingRelation[];
}

export interface EvaluationSet {
  highlights?: FilterableHighlight[];
  arcs?: FilterableArc[];
}

export type EvaluationElement = FilterableHighlight | FilterableArc;

export type NodeComponent = FunctionComponent<NodeComponentProps>;

export interface NodeComponentProps {
  editMode: boolean;

  endowedNode: EndowedNode;

  relationChooserProps: RelationChooserConnectedProps;
  dataOnDay: (day: IpsumDay) => Promise<DatePickerDayData>;

  /** @deprecated */
  transformProgram: (
    transform: (program: IpsumFilteringProgramV1) => IpsumFilteringProgramV1
  ) => IpsumFilteringProgramV1;

  performAction: <A extends FilterTreeAction<Parameters<A>[0]["args"]>, T>(
    action: A,
    args: Parameters<A>[0]["args"]
  ) => IpsumFilteringProgramV1;

  childComponents: JSX.Element[];
}

export interface EndowedNode {
  coordinates: number[];

  type: EndowedNodeType;

  /** All values from the un-endowed token that originates from the EBNF parser. */
  rawNode: IToken;

  children: EndowedNode[];

  component: NodeComponent;
}

export type EndowedNodeType =
  | "undefined"
  | "ifl"
  | "filter"
  | "filter_expression_highlights"
  | "filter_expression_arcs"
  | "sort_expression_highlights"
  | "highlights_expression"
  | "highlights_expression_conjunction"
  | "highlights_expression_disjunction"
  | "highlights_criterion"
  | "highlights_criterion_dates"
  | "highlights_criterion_relation"
  | "highlights_sort"
  | "highlights_sort_as_of"
  | "highlights_sort_type"
  | "predicate"
  | "relation_object"
  | "day";

export type SortType =
  | "review status"
  | "importance"
  | "recent first"
  | "oldest first";

export type FilterType = "highlights" | "arcs";

export interface RuleDefinition {
  rule: string;
  component: NodeComponent;
}
