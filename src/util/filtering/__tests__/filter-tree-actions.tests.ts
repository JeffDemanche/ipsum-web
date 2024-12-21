import {
  addFilterExpression,
  removeFilterExpression,
} from "../components/filter-tree-actions";
import { createFilteringProgram } from "../versions";

describe("filter tree actions", () => {
  describe("removeFilterExpression", () => {
    test("removes filter expression from conjuction", () => {
      const program = createFilteringProgram("v1");
      program.setProgram(
        'highlights (which relates to "arc name" and which relates to "arc name 2") sorted by review status as of "today"'
      );

      const relationExpressionNode = program.findEndowedNodesByType(
        "highlights_expression"
      )[2];

      const newProgram = removeFilterExpression({
        program,
        args: { expression: relationExpressionNode },
      });

      expect(relationExpressionNode.rawNode.text).toEqual(
        'which relates to "arc name 2"'
      );
      expect(newProgram.programString).toBe(
        'highlights which relates to "arc name" sorted by review status as of "today"'
      );
    });

    test("removes filter expression from disjunction", () => {
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

    test("removes first clause from conjunction", () => {
      const program = createFilteringProgram("v1");
      program.setProgram(
        'highlights (from "beginning" to "today" and which relates to "arc name") sorted by review status as of "today"'
      );

      const relationExpressionNode = program.findEndowedNodesByType(
        "highlights_expression"
      )[1];

      const newProgram = removeFilterExpression({
        program,
        args: { expression: relationExpressionNode },
      });

      expect(relationExpressionNode.rawNode.text).toEqual(
        'from "beginning" to "today"'
      );
      expect(newProgram.programString).toBe(
        'highlights which relates to "arc name" sorted by review status as of "today"'
      );
    });
  });

  describe("addFilterExpression", () => {
    test("adds filter expression as new conjunction", () => {
      const program = createFilteringProgram("v1");
      program.setProgram(
        'highlights from "beginning" to "today" sorted by review status as of "today"'
      );

      const filterExpressionNode = program.findEndowedNodesByType(
        "highlights_criterion"
      )[0];

      const newProgram = addFilterExpression({
        program,
        args: {
          parentNode: filterExpressionNode,
          expression: {
            type: "relation",
            defaultPredicate: "relates to",
            defaultObject: "arc name",
          },
          logicType: "and",
        },
      });

      expect(newProgram.programString).toBe(
        'highlights (from "beginning" to "today" and which relates to "arc name") sorted by review status as of "today"'
      );
    });

    test("appends filter expression to existing conjunction", () => {
      const program = createFilteringProgram("v1");
      program.setProgram(
        'highlights (from "beginning" to "today" and which relates to "arc name") sorted by review status as of "today"'
      );

      const filterExpressionNode = program.findEndowedNodesByType(
        "highlights_expression_conjunction"
      )[0];

      const newProgram = addFilterExpression({
        program,
        args: {
          parentNode: filterExpressionNode,
          expression: {
            type: "relation",
            defaultPredicate: "relates to",
            defaultObject: "arc name 2",
          },
          logicType: "and",
        },
      });

      expect(newProgram.programString).toBe(
        'highlights (from "beginning" to "today" and which relates to "arc name" and which relates to "arc name 2") sorted by review status as of "today"'
      );
    });

    test("appends a third filter expression to existing conjunction", () => {
      const program = createFilteringProgram("v1");
      program.setProgram(
        'highlights (from "beginning" to "today" and which relates to "arc name" and which relates to "arc name 2") sorted by review status as of "today"'
      );

      const filterExpressionNode = program.findEndowedNodesByType(
        "highlights_expression_conjunction"
      )[0];

      const newProgram = addFilterExpression({
        program,
        args: {
          parentNode: filterExpressionNode,
          expression: {
            type: "relation",
            defaultPredicate: "relates to",
            defaultObject: "arc name 3",
          },
          logicType: "and",
        },
      });

      expect(newProgram.programString).toBe(
        'highlights (from "beginning" to "today" and which relates to "arc name" and which relates to "arc name 2" and which relates to "arc name 3") sorted by review status as of "today"'
      );
    });

    test("adds disjunction within existing conjunction", () => {
      const program = createFilteringProgram("v1");
      program.setProgram(
        'highlights (from "beginning" to "today" and which relates to "arc name") sorted by review status as of "today"'
      );

      const filterExpressionNode = program.findEndowedNodesByType(
        "highlights_expression_conjunction"
      )[0];

      const newProgram = addFilterExpression({
        program,
        args: {
          parentNode: filterExpressionNode,
          expression: {
            type: "relation",
            defaultPredicate: "relates to",
            defaultObject: "arc name 2",
          },
          logicType: "or",
        },
      });

      expect(newProgram.programString).toBe(
        'highlights ((from "beginning" to "today" and which relates to "arc name") or which relates to "arc name 2") sorted by review status as of "today"'
      );
    });
  });
});
