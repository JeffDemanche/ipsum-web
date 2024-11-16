import { RelationChooserConnectedProps } from "components/hooks/use-relation-chooser-connected";
import { IToken } from "ebnf";
import { FunctionComponent } from "react";
import { IpsumDay } from "util/dates";

import { IpsumFilteringProgramV1 } from "./program";

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

  transformProgram: (
    transform: (program: IpsumFilteringProgramV1) => IpsumFilteringProgramV1
  ) => boolean;

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

type EndowedNodeType =
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
