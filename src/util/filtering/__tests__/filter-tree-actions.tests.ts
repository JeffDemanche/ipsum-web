import { removeFilterExpression } from "../components/filter-tree-actions";
import { createFilteringProgram } from "../versions";

describe("filter tree actions", () => {
  it("removes filter expression from conjuction", () => {
    const program = createFilteringProgram("v1");
    program.setProgram(
      'highlights (from "beginning" to "today" and which relates to "arc name") sorted by review status as of "today"'
    );

    const relationExpressionNode = program.findEndowedNodesByType(
      "highlights_expression"
    )[2];

    const newProgram = removeFilterExpression({
      program,
      args: { expression: relationExpressionNode },
    });

    expect(relationExpressionNode.rawNode.text).toEqual(
      'which relates to "arc name"'
    );
    expect(newProgram.programString).toBe(
      'highlights from "beginning" to "today" sorted by review status as of "today"'
    );
  });

  it("removes filter expression from disjunction", () => {
    const program = createFilteringProgram("v1");
    program.setProgram(
      'highlights (from "beginning" to "today" or which relates to "arc 1 name" or which relates to "arc 2 name") sorted by review status as of "today"'
    );

    const relationExpressionNode = program.findEndowedNodesByType(
      "highlights_expression"
    )[2];

    const newProgram = removeFilterExpression({
      program,
      args: { expression: relationExpressionNode },
    });

    expect(relationExpressionNode.rawNode.text).toEqual(
      'which relates to "arc 1 name"'
    );
    expect(newProgram.programString).toBe(
      'highlights (from "beginning" to "today" or which relates to "arc 2 name") sorted by review status as of "today"'
    );
  });
});
