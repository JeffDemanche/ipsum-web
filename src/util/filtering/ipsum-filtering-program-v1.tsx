import type { IToken } from "ebnf";
import _ from "lodash";
import { IpsumDay } from "util/dates";

import { IpsumFilteringProgram } from "./abstract-filtering-program";
import { definitionForRule, ebnf } from "./definition";
import type {
  EndowedNode,
  EndowedNodeType,
  EvaluationElement,
  EvaluationSet,
  FilterableHighlight,
  SortType,
} from "./types";

const DEFAULT_SORT_TYPE: SortType = "recent first";

export class IpsumFilteringProgramV1 extends IpsumFilteringProgram {
  private __program: string;
  private __ast: IToken;
  private __endowedAst: EndowedNode;

  constructor() {
    super(ebnf);
  }

  setProgram(program: string) {
    this.__program = program;
    this.__ast = this.createAst(program, {});
    this.__endowedAst = this.generateEndowedAST();

    return this;
  }

  get errors() {
    if (!this.__ast) {
      return ["AST failed to generate"];
    }

    return this.__ast.errors;
  }

  updateNodeText(
    nodeToReplace: EndowedNode,
    newNodeText: string
  ): IpsumFilteringProgramV1 {
    const findAndReplaceNode = (node: EndowedNode): string => {
      const beforeNodeProgram = this.__program.slice(0, node.rawNode.start);
      const afterNodeProgram = this.__program.slice(node.rawNode.end);

      if (_.isEqual(node.coordinates, nodeToReplace.coordinates)) {
        return `${beforeNodeProgram}${newNodeText}${afterNodeProgram}`;
      } else if (node.children.length) {
        return node.children
          .map((child) => findAndReplaceNode(child))
          .find(Boolean);
      }
    };

    const newProgramString = findAndReplaceNode(this.__endowedAst);

    const newProgram = new IpsumFilteringProgramV1().setProgram(
      newProgramString
    );
    return newProgram;
  }

  get programString() {
    return this.__program;
  }

  private generateEndowedASTPerNode(
    node: IToken,
    currentCoords: number[]
  ): EndowedNode {
    if (node === null) {
      return null;
    }

    const definition = definitionForRule(
      node.type as Exclude<EndowedNodeType, "undefined">
    );

    if (!definition) {
      return {
        type: "undefined",
        component: null,
        coordinates: currentCoords,
        rawNode: node,
        children: node.children.map((child, i) =>
          this.generateEndowedASTPerNode(child, [...currentCoords, i])
        ),
      };
    }

    return {
      component: definition.component,
      type: node.type as EndowedNodeType,
      coordinates: currentCoords,
      rawNode: node,
      children: node.children.map((child, i) =>
        this.generateEndowedASTPerNode(child, [...currentCoords, i])
      ),
    };
  }

  getEndowedAST(): EndowedNode {
    return this.__endowedAst;
  }

  generateEndowedAST() {
    const filterExpression = this.__ast;

    return this.generateEndowedASTPerNode(filterExpression, [0, 0]);
  }

  private evalFiltersPerElement(
    node: EndowedNode
  ): (element: EvaluationElement) => boolean {
    if (!node) {
      return () => false;
    }

    switch (node.type) {
      case "ifl": {
        return this.evalFiltersPerElement(node.children[0]);
      }

      case "filter": {
        return this.evalFiltersPerElement(node.children[0]);
      }

      case "filter_expression_highlights": {
        const rootExpression = node.children.find(
          (child) => child.type === "highlights_expression"
        );

        return (element) => {
          if (element.type !== "highlight") return false;

          if (
            !this.findEndowedNodeByType(rootExpression, "highlights_expression")
          )
            return true;

          return this.evalFiltersPerElement(rootExpression)(element);
        };
      }

      case "highlights_expression": {
        return (element) =>
          this.evalFiltersPerElement(node.children[0])(element);
      }

      case "highlights_criterion": {
        return (element) =>
          this.evalFiltersPerElement(node.children[0])(element);
      }

      case "highlights_expression_conjunction": {
        return (element) => {
          // Ensure we're only evaluating the expressions, not other tokens
          const childExpressions = node.children.filter(
            (child) => child.type === "highlights_expression"
          );
          return childExpressions.every((child) => {
            return this.evalFiltersPerElement(child)(element);
          });
        };
      }

      case "highlights_expression_disjunction": {
        return (element) => {
          const childExpressions = node.children.filter(
            (child) => child.type === "highlights_expression"
          );
          return childExpressions.some((child) =>
            this.evalFiltersPerElement(child)(element)
          );
        };
      }

      case "highlights_criterion_dates": {
        const days = node.children.filter((child) => child.type === "day");

        const dayFromString = days[0].rawNode.text.slice(1, -1);
        const dayToString = days[1].rawNode.text.slice(1, -1);

        const dayFrom = IpsumFilteringProgramV1.evaluateDayNode(days[0]);
        const dayTo = IpsumFilteringProgramV1.evaluateDayNode(days[1]);

        if (!dayFrom.toLuxonDateTime().isValid) {
          throw new IFLExecutionError(
            `Invalid day string: ${dayFromString}. Valid day strings are "today", "beginning", or "M/D/YYYY"`
          );
        }
        if (!dayTo.toLuxonDateTime().isValid) {
          throw new IFLExecutionError(
            `Invalid day string: ${dayToString}. Valid day strings are "today", "beginning", or "M/D/YYYY"`
          );
        }

        return (element) => element.day.isBetween(dayFrom, dayTo);
      }

      case "highlights_criterion_relation": {
        const filterPredicate = node.children.find(
          (child) => child.type === "predicate"
        ).rawNode.text;
        const filterRelationObject = node.children
          .find((child) => child.type === "relation_object")
          .rawNode.text.slice(1, -1);

        return (element) => {
          return element.outgoingRelations.some((relation) => {
            return (
              relation.predicate === filterPredicate &&
              (relation.objectName === filterRelationObject ||
                relation.objectId === filterRelationObject)
            );
          });
        };
      }

      default:
        return () => false;
    }
  }

  static evaluateDayNode(node: EndowedNode): IpsumDay {
    if (node.type === "day") {
      let text = node.rawNode.text.slice(1, -1);

      if (text === "today") {
        text = IpsumDay.today().toString("stored-day");
      }
      if (text === "beginning") {
        text = IpsumDay.beginning().toString("stored-day");
      }
      const day = IpsumDay.fromString(text, "stored-day");
      if (!day.toLuxonDateTime().isValid) {
        throw new IFLExecutionError(
          `Invalid day string: ${text}. Valid day strings are "today", "beginning", or "M/D/YYYY"`
        );
      }

      return day;
    }
    return undefined;
  }

  findEndowedNodesByType(
    type: EndowedNodeType,
    sourceNode?: EndowedNode
  ): EndowedNode[] {
    const findEndowedNodesByType = (
      node: EndowedNode,
      type: EndowedNodeType
    ): EndowedNode[] => {
      if (!node) {
        return [];
      }

      if (node.type === type) {
        return [
          node,
          ...node.children
            .map((child) => findEndowedNodesByType(child, type))
            .flat(),
        ];
      }

      return node.children
        .map((child) => findEndowedNodesByType(child, type))
        .flat();
    };

    return findEndowedNodesByType(sourceNode ?? this.__endowedAst, type);
  }

  findParentOfNode(node: EndowedNode): EndowedNode {
    if (!node) {
      return undefined;
    }

    return this.findEndowedNodeByCoordinates(node.coordinates.slice(0, -1));
  }

  private findEndowedNodeByType(
    node: EndowedNode,
    type: EndowedNodeType
  ): EndowedNode {
    if (!node) {
      return undefined;
    }

    if (node.type === type) {
      return node;
    }

    return node.children
      .map((child) => this.findEndowedNodeByType(child, type))
      .find(Boolean);
  }

  private findEndowedNodeByCoordinates(
    coordinates: number[],
    node: EndowedNode = this.__endowedAst
  ): EndowedNode {
    if (!node) {
      return undefined;
    }

    if (_.isEqual(node.coordinates, coordinates)) {
      return node;
    }

    return node.children
      .map((child) => this.findEndowedNodeByCoordinates(coordinates, child))
      .find(Boolean);
  }

  private evalSortHighlights(
    sortExpression: EndowedNode
  ): (a: FilterableHighlight, b: FilterableHighlight) => number {
    const sortType =
      this.findEndowedNodeByType(sortExpression, "highlights_sort_type")
        ?.rawNode?.text ?? DEFAULT_SORT_TYPE;

    const asOfNode = this.findEndowedNodeByType(
      sortExpression,
      "highlights_sort_as_of"
    );

    const asOfDayNode = this.findEndowedNodeByType(asOfNode, "day");
    const asOfDay = asOfDayNode
      ? IpsumFilteringProgramV1.evaluateDayNode(
          this.findEndowedNodeByType(asOfNode, "day")
        )
      : IpsumDay.today();

    switch (sortType) {
      case "review status": {
        return (a: FilterableHighlight, b: FilterableHighlight) => {
          const aUpForReview = a.srsCard?.upForReview(asOfDay);
          const bUpForReview = b.srsCard?.upForReview(asOfDay);

          if (a.srsCard && !b.srsCard) {
            return -1;
          }
          if (!a.srsCard && b.srsCard) {
            return 1;
          }
          if (!a.srsCard && !b.srsCard) {
            return a.day.isBefore(b.day) ? 1 : -1;
          }

          if (aUpForReview && !bUpForReview) {
            return -1;
          }
          if (!aUpForReview && bUpForReview) {
            return 1;
          } else {
            return a.srsCard.nextReviewDay().isBefore(b.srsCard.nextReviewDay())
              ? -1
              : 1;
          }
        };
      }
      case "importance": {
        return (a: FilterableHighlight, b: FilterableHighlight) => {
          return 0;
        };
      }
      case "recent first": {
        return (a: FilterableHighlight, b: FilterableHighlight) => {
          return a.day.isBefore(b.day) ? 1 : -1;
        };
      }
      case "oldest first": {
        return (a: FilterableHighlight, b: FilterableHighlight) => {
          return a.day.isBefore(b.day) ? -1 : 1;
        };
      }
      default: {
        return (a: FilterableHighlight, b: FilterableHighlight) => {
          return 0;
        };
      }
    }
  }

  evaluate({ highlights, arcs }: EvaluationSet): EvaluationSet {
    // "highlights from "1/1/2020" to "2/1/2020" which relate to ..."
    const filterExpression = this.__ast.children[0].children[0];

    // "filter_expression_highlights" or "filter_expression_arcs"
    const filterType = filterExpression?.type;

    const sortHighlightsEndowedNode = this.findEndowedNodeByType(
      this.__endowedAst,
      "highlights_sort"
    );

    const sortFn = this.evalSortHighlights(sortHighlightsEndowedNode);

    const evalFn = this.evalFiltersPerElement(this.__endowedAst);

    switch (filterType) {
      case "filter_expression_highlights":
        return {
          highlights:
            highlights
              ?.filter((highlight) => {
                const c = evalFn(highlight);
                return c;
              })
              ?.sort(sortFn) ?? [],
        };
      case "filter_expression_arcs":
        return {
          arcs: arcs?.filter((arc) => evalFn(arc)) ?? [],
        };
      default:
        return {};
    }
  }

  get sortType() {
    const sortExpression = this.findEndowedNodeByType(
      this.__endowedAst,
      "highlights_sort"
    );

    return this.findEndowedNodeByType(sortExpression, "highlights_sort_type")
      ?.rawNode.text as SortType;
  }
}

export class IFLExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IFLExecutionError";
  }
}
