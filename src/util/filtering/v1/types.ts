import { IToken } from "ebnf";
import { FunctionComponent } from "react";

export type NodeComponent = FunctionComponent<NodeComponentProps>;

export interface NodeComponentProps {
  editMode: boolean;

  endowedNode: EndowedNode;

  onRemoveChild: (childIndex: number) => void;
  onAddChild: () => void;
  onDeleteSelf: () => void;

  childComponents: JSX.Element[];
}

export interface EndowedNode {
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
