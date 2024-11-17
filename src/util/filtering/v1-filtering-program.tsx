import { IToken } from "ebnf";
import _ from "lodash";
import { IpsumDay } from "util/dates";

import { IpsumFilteringProgram } from "./abstract-filtering-program";
import { definitionForRule, ebnf } from "./definition";
import {
  EndowedNode,
  EndowedNodeType,
  EvaluationElement,
  EvaluationSet,
} from "./types";

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
    node: EndowedNode,
    element: EvaluationElement
  ): boolean {
    if (!node) {
      return true;
    }

    switch (node.type) {
      case "ifl": {
        return this.evalFiltersPerElement(node.children[0], element);
      }

      case "filter": {
        return this.evalFiltersPerElement(node.children[0], element);
      }

      case "filter_expression_highlights": {
        if (element.type !== "highlight") return false;

        const rootExpression = node.children.find(
          (child) => child.type === "highlights_expression"
        );

        return this.evalFiltersPerElement(rootExpression, element);
      }

      case "highlights_expression": {
        if (element.type !== "highlight") return false;

        return this.evalFiltersPerElement(node.children[0], element);
      }

      case "highlights_criterion": {
        if (element.type !== "highlight") return false;

        return this.evalFiltersPerElement(node.children[0], element);
      }

      case "highlights_expression_conjunction": {
        if (element.type !== "highlight") return false;

        return node.children.every((child) =>
          this.evalFiltersPerElement(child, element)
        );
      }

      case "highlights_expression_disjunction": {
        if (element.type !== "highlight") return false;

        return node.children.some((child) =>
          this.evalFiltersPerElement(child, element)
        );
      }

      case "highlights_criterion_dates": {
        if (element.type !== "highlight") return false;

        const days = node.children.filter((child) => child.type === "day");

        let dayFromString = days[0].rawNode.text.slice(1, -1);
        let dayToString = days[1].rawNode.text.slice(1, -1);

        if (dayFromString === "today") {
          dayFromString = IpsumDay.today().toString("stored-day");
        }
        if (dayFromString === "beginning") {
          dayFromString = IpsumDay.beginning().toString("stored-day");
        }

        if (dayToString === "today") {
          dayToString = IpsumDay.today().toString("stored-day");
        }
        if (dayToString === "beginning") {
          dayToString = IpsumDay.beginning().toString("stored-day");
        }

        const dayFrom = IpsumDay.fromString(dayFromString, "stored-day");
        const dayTo = IpsumDay.fromString(dayToString, "stored-day");

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

        return element.day.isBetween(dayFrom, dayTo);
      }

      case "highlights_criterion_relation": {
        if (element.type !== "highlight") return false;

        const filterPredicate = node.children.find(
          (child) => child.type === "predicate"
        ).rawNode.text;
        const filterRelationObject = node.children
          .find((child) => child.type === "relation_object")
          .rawNode.text.slice(1, -1);

        return element.outgoingRelations.some((relation) => {
          return (
            relation.predicate === filterPredicate &&
            relation.objectName === filterRelationObject
          );
        });
      }

      default:
        return true;
    }
  }

  private executeSort() {}

  evaluate({ highlights, arcs }: EvaluationSet): EvaluationSet {
    // "highlights from "1/1/2020" to "2/1/2020" which relate to ..."
    const filterExpression = this.__ast.children[0].children[0];

    // "filter_expression_highlights" or "filter_expression_arcs"
    const filterType = filterExpression?.type;

    const sortExpression = this.__ast.children[0].children[1];

    switch (filterType) {
      case "filter_expression_highlights":
        return {
          highlights:
            highlights?.filter((highlight) =>
              this.evalFiltersPerElement(this.__endowedAst, highlight)
            ) ?? [],
        };
      case "filter_expression_arcs":
        return {
          arcs:
            arcs?.filter((arc) =>
              this.evalFiltersPerElement(this.__endowedAst, arc)
            ) ?? [],
        };
      default:
        return {};
    }
  }
}

export class IFLExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IFLExecutionError";
  }
}
