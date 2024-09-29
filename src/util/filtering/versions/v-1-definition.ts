export const ebnf = `
ifl ::= filter

filter ::= "highlights" (WS+ highlights_expression)? (WS+ highlights_sort)? | "arcs"

highlights_expression ::= (highlights_criterion | highlights_expression_conjunction | highlights_expression_disjunction)

highlights_expression_conjunction ::= "(" (highlights_expression WS+ "and" WS+)* highlights_expression ")"
highlights_expression_disjunction ::= "(" (highlights_expression WS+ "or" WS+)* highlights_expression ")"

highlights_criterion ::= highlights_criterion_dates | highlights_criterion_relation

highlights_criterion_dates ::= "from" WS+ day WS* "to" WS+ day
highlights_criterion_relation ::= "which" WS+ predicate WS+ relation_object

highlights_sort ::= "sorted by" WS+ highlights_sort_type highlights_sort_as_of?
highlights_sort_as_of ::= WS+ "as of" WS+ day
highlights_sort_type ::= "importance" | "recent"

predicate ::= "are" | "relate to"
relation_object ::= STRING

day ::= STRING

STRING    ::= '"' ([1-9] | [a-z])+ '"'
WS        ::= [#x20#x09#x0A#x0D]+
`;
