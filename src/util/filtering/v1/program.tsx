import { IToken } from "ebnf";
import { IpsumDay } from "util/dates";

import { IpsumFilteringProgram } from "../filtering-language";
import { Node_day } from "./components/Node_day";
import { Node_filter } from "./components/Node_filter";
import { Node_filter_expression_arcs } from "./components/Node_filter_expression_arcs";
import { Node_filter_expression_highlights } from "./components/Node_filter_expression_highlights";
import { Node_highlights_criterion } from "./components/Node_highlights_criterion";
import { Node_highlights_criterion_dates } from "./components/Node_highlights_criterion_dates";
import { Node_highlights_criterion_relation } from "./components/Node_highlights_criterion_relation";
import { Node_highlights_expression } from "./components/Node_highlights_expression";
import { Node_highlights_expression_conjunction } from "./components/Node_highlights_expression_conjunction";
import { Node_highlights_expression_disjunction } from "./components/Node_highlights_expression_disjunction";
import { Node_highlights_sort } from "./components/Node_highlights_sort";
import { Node_highlights_sort_as_of } from "./components/Node_highlights_sort_as_of";
import { Node_highlights_sort_type } from "./components/Node_highlights_sort_type";
import { Node_ifl } from "./components/Node_ifl";
import { Node_predicate } from "./components/Node_predicate";
import { Node_relation_object } from "./components/Node_relation_object";
import { ebnf } from "./definition";
import { EndowedNode } from "./types";

export interface FilterableHighlight {
  type: "highlight";
  day: IpsumDay;
}

export interface FilterableArc {
  type: "arc";
  day: IpsumDay;
}

interface EvaluationSet {
  highlights?: FilterableHighlight[];
  arcs?: FilterableArc[];
}

export type EvaluationElement = FilterableHighlight | FilterableArc;

export class IpsumFilteringProgramV1 extends IpsumFilteringProgram {
  private __program: string;
  private __ast: IToken;
  private __endowedAst: EndowedNode;

  constructor() {
    super(ebnf);
  }

  setProgram(program: string) {
    this.__program = program;
    this.__ast = this.getAst(program, {});
    this.__endowedAst = this.generateEndowedAST();

    return this;
  }

  private generateEndowedASTPerNode(node: IToken): EndowedNode {
    const defaults = {
      rawNode: node,
      children: node.children.map((child) =>
        this.generateEndowedASTPerNode(child)
      ),
    };

    switch (node.type) {
      case "ifl":
        return {
          ...defaults,
          type: "ifl",
          component: Node_ifl,
        };

      case "filter":
        return {
          ...defaults,
          type: "filter",
          component: Node_filter,
        };

      case "filter_expression_highlights":
        return {
          ...defaults,
          type: "filter_expression_highlights",
          component: Node_filter_expression_highlights,
        };

      case "filter_expression_arcs":
        return {
          ...defaults,
          type: "filter_expression_arcs",
          component: Node_filter_expression_arcs,
        };

      case "sort_expression_highlights":
        return {
          ...defaults,
          type: "sort_expression_highlights",
          component: Node_filter_expression_highlights,
        };

      case "highlights_expression":
        return {
          ...defaults,
          type: "highlights_expression",
          component: Node_highlights_expression,
        };

      case "highlights_expression_conjunction":
        return {
          ...defaults,
          type: "highlights_expression_conjunction",
          component: Node_highlights_expression_conjunction,
        };

      case "highlights_expression_disjunction":
        return {
          ...defaults,
          type: "highlights_expression_disjunction",
          component: Node_highlights_expression_disjunction,
        };

      case "highlights_criterion":
        return {
          ...defaults,
          type: "highlights_criterion",
          component: Node_highlights_criterion,
        };

      case "highlights_criterion_dates":
        return {
          ...defaults,
          type: "highlights_criterion_dates",
          component: Node_highlights_criterion_dates,
        };

      case "highlights_criterion_relation":
        return {
          ...defaults,
          type: "highlights_criterion_relation",
          component: Node_highlights_criterion_relation,
        };

      case "highlights_sort":
        return {
          ...defaults,
          type: "highlights_sort",
          component: Node_highlights_sort,
        };

      case "highlights_sort_as_of":
        return {
          ...defaults,
          type: "highlights_sort_as_of",
          component: Node_highlights_sort_as_of,
        };

      case "highlights_sort_type":
        return {
          ...defaults,
          type: "highlights_sort_type",
          component: Node_highlights_sort_type,
        };

      case "predicate":
        return {
          ...defaults,
          type: "predicate",
          component: Node_predicate,
        };

      case "relation_object":
        return {
          ...defaults,
          type: "relation_object",
          component: Node_relation_object,
        };

      case "day":
        return {
          ...defaults,
          type: "day",
          component: Node_day,
        };

      default:
        return {
          ...defaults,
          type: "undefined",
          component: null,
        };
    }
  }

  getEndowedAST(): EndowedNode {
    return this.__endowedAst;
  }

  generateEndowedAST() {
    const filterExpression = this.__ast;

    return this.generateEndowedASTPerNode(filterExpression);
  }

  private evalFiltersPerElement(
    node: EndowedNode,
    element: EvaluationElement
  ): boolean {
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
        return true;
      }

      default:
        return true;
    }
  }

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
