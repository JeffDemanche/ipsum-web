import { IToken } from "ebnf";
import { IpsumDay } from "util/dates";

import { IpsumFilteringLanguage } from "../filtering-language";
import { ebnf } from "./v1-definition";
import { V1EndowedNode } from "./v1-types";

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

export class IpsumFilteringProgramV1 extends IpsumFilteringLanguage {
  private __program: string;
  private __ast: IToken;

  constructor(program: string) {
    super(ebnf);
    this.__program = program;
    this.__ast = this.getAst(program, {});
  }

  private generateEndowedASTPerNode(node: IToken): V1EndowedNode {
    switch (node.type) {
      case "ifl":
        return {
          type: "ifl",
          children: [this.generateEndowedASTPerNode(node.children[0])],
        };

      case "filter":
        return {
          type: "filter",
          children: [this.generateEndowedASTPerNode(node.children[0])],
        };

      default:
        return {
          type: "undefined",
          children: [],
        };
    }
  }

  generateEndowedAST() {
    const filterExpression = this.__ast.children[0].children[0];

    return this.generateEndowedASTPerNode(filterExpression);
  }

  private evalFiltersPerElement(
    node: IToken,
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

        let dayFromString = days[0].text.slice(1, -1);
        let dayToString = days[1].text.slice(1, -1);

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
              this.evalFiltersPerElement(this.__ast, highlight)
            ) ?? [],
        };
      case "filter_expression_arcs":
        return {
          arcs:
            arcs?.filter((arc) =>
              this.evalFiltersPerElement(this.__ast, arc)
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
