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
import { Node_sort_expression_highlights } from "./components/Node_sort_expression_highlights";
import { EndowedNodeType, RuleDefinition } from "./types";

const globalRules = `
STRING    ::= '"' CHAR* '"'
WS        ::= [#x20#x09#x0A#x0D]+

ESCAPE          ::= #x5C /* back slash */
HEXDIG          ::= [a-fA-F0-9]
ESCAPABLE       ::= #x22 | #x5C | #x2F | #x62 | #x66 | #x6E | #x72 | #x74 | #x75 HEXDIG HEXDIG HEXDIG HEXDIG
CHAR            ::= UNESCAPED | ESCAPE ESCAPABLE
UNESCAPED       ::= [#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]
`;

// WIP Generate EBNF from the code
const definitions: Record<
  Exclude<EndowedNodeType, "undefined">,
  RuleDefinition
> = {
  ifl: {
    rule: "filter (WS+)?",
    component: Node_ifl,
  },
  filter: {
    rule: "filter_expression_highlights | filter_expression_arcs",
    component: Node_filter,
  },
  filter_expression_highlights: {
    rule: '"highlights" (WS+ highlights_expression)? sort_expression_highlights?',
    component: Node_filter_expression_highlights,
  },
  filter_expression_arcs: {
    rule: '"arcs"',
    component: Node_filter_expression_arcs,
  },
  sort_expression_highlights: {
    rule: "(WS+ highlights_sort)",
    component: Node_sort_expression_highlights,
  },
  highlights_expression: {
    rule: "(highlights_criterion | highlights_expression_conjunction | highlights_expression_disjunction)",
    component: Node_highlights_expression,
  },
  highlights_expression_conjunction: {
    rule: '"(" (highlights_expression WS+ "and" WS+)* highlights_expression ")"',
    component: Node_highlights_expression_conjunction,
  },
  highlights_expression_disjunction: {
    rule: '"(" (highlights_expression WS+ "or" WS+)* highlights_expression ")"',
    component: Node_highlights_expression_disjunction,
  },
  highlights_criterion: {
    rule: "highlights_criterion_dates | highlights_criterion_relation",
    component: Node_highlights_criterion,
  },
  highlights_criterion_dates: {
    rule: '"from" WS+ day WS* "to" WS+ day',
    component: Node_highlights_criterion_dates,
  },
  highlights_criterion_relation: {
    rule: '"which" WS+ predicate WS+ relation_object',
    component: Node_highlights_criterion_relation,
  },
  highlights_sort: {
    rule: '"sorted by" WS+ highlights_sort_type highlights_sort_as_of?',
    component: Node_highlights_sort,
  },
  highlights_sort_as_of: {
    rule: 'WS+ "as of" WS+ day',
    component: Node_highlights_sort_as_of,
  },
  highlights_sort_type: {
    rule: '"review status" | "importance" | "recent"',
    component: Node_highlights_sort_type,
  },
  predicate: {
    rule: '"is" | "relates to"',
    component: Node_predicate,
  },
  relation_object: {
    rule: "STRING",
    component: Node_relation_object,
  },
  day: {
    rule: "STRING",
    component: Node_day,
  },
};

export const definitionForRule = (
  rule: Exclude<EndowedNodeType, "undefined">
): RuleDefinition => {
  return definitions[rule];
};

export const ebnf = `
${Object.keys(definitions)
  .map((key: Exclude<EndowedNodeType, "undefined">) => {
    return `${key} ::= ${definitions[key].rule}`;
  })
  .join("\n")}
  
${globalRules}
  `;
