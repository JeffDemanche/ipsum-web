export const ebnf = `
ifl ::= filter

filter ::= "highlights" filter_expression_highlights? | "arcs" filter_expression_arcs?

filter_expression_highlights ::= (WS+ highlights_expression)? sort_expression_highlights?
filter_expression_arcs ::= "unused"

sort_expression_highlights ::= (WS+ highlights_sort)

highlights_expression ::= (highlights_criterion | highlights_expression_conjunction | highlights_expression_disjunction)

highlights_expression_conjunction ::= "(" (highlights_expression WS+ "and" WS+)* highlights_expression ")"
highlights_expression_disjunction ::= "(" (highlights_expression WS+ "or" WS+)* highlights_expression ")"

highlights_criterion ::= highlights_criterion_dates | highlights_criterion_relation

highlights_criterion_dates ::= "from" WS+ day WS* "to" WS+ day
highlights_criterion_relation ::= "which" WS+ predicate WS+ relation_object

highlights_sort ::= "sorted by" WS+ highlights_sort_type highlights_sort_as_of?
highlights_sort_as_of ::= WS+ "as of" WS+ day
highlights_sort_type ::= "importance" | "recent"

predicate ::= "is" | "relates to"
relation_object ::= STRING

day ::= STRING

STRING    ::= '"' CHAR* '"'
WS        ::= [#x20#x09#x0A#x0D]+

ESCAPE          ::= #x5C /* back slash */
HEXDIG          ::= [a-fA-F0-9]
ESCAPABLE       ::= #x22 | #x5C | #x2F | #x62 | #x66 | #x6E | #x72 | #x74 | #x75 HEXDIG HEXDIG HEXDIG HEXDIG
CHAR            ::= UNESCAPED | ESCAPE ESCAPABLE
UNESCAPED       ::= [#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]
`;
