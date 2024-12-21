import { IpsumDay } from "util/dates";
import { IpsumSRSCard } from "util/repetition";

import { IpsumFilteringProgramV1 } from "../ipsum-filtering-program-v1";
import { EndowedNode, FilterableHighlight } from "../types";
import { createFilteringProgram } from "../versions";

const mock_hl = (
  mock: Partial<FilterableHighlight> & { id: string }
): FilterableHighlight => {
  return {
    type: "highlight",
    day: IpsumDay.fromString("1/1/2020", "stored-day"),
    outgoingRelations: [],
    srsCard: null,
    ...mock,
  };
};

describe("IpsumFilteringProgramV1", () => {
  describe("parsing", () => {
    test("should build AST from simple string", () => {
      const ifl = createFilteringProgram("v1");

      const ast = ifl.createAst("highlights", {});

      expect(ast.errors).toHaveLength(0);
    });

    test("should return error when parsing simple invalid string", () => {
      const ifl = createFilteringProgram("v1");

      const ast = ifl.createAst("highlights bad", {});

      expect(ast.errors).toHaveLength(1);
      expect(ast.errors[0].message).toBe("Unexpected end of input: \nbad");
    });

    test("should validate simple highlight filter expression", () => {
      const ifl = createFilteringProgram("v1");

      const ast = ifl.createAst('highlights from "1" to "2"', {});

      expect(ast.errors).toHaveLength(0);
    });

    test("should validate conjuction", () => {
      const ifl = createFilteringProgram("v1");

      const ast = ifl.createAst(
        'highlights (which is "1" and from "1" to "2")',
        {}
      );

      expect(ast.errors).toHaveLength(0);
    });

    test.each([
      ['highlights from "1" to "2"', 0],
      ['highlights which is "1"', 0],
      ['highlights which relates to "1"', 0],
      ['highlights (which relates to "1" and which relates to "2")', 0],
      [
        'highlights (which relates to "1" and which relates to "2" and which relates to "3")',
        0,
      ],
      ['highlights (which relates to "1" or which relates to "2")', 0],
      [
        'highlights (from "1" to "2" and (which relates to "2" or which relates to "3"))',
        0,
      ],
      ["highlights sorted by importance", 0],
      ['highlights sorted by importance as of "1"', 0],
      ["highlights sorted by recent first", 0],
      ['highlights sorted by recent first as of "1"', 0],
      [
        'highlights (from "1" to "2" and which relates to "3") sorted by recent first as of "1"',
        0,
      ],
    ])("should be valid: `%s`", (text, expectedErrors) => {
      const ifl = createFilteringProgram("v1");

      const ast = ifl.createAst(text, {});

      expect(ast.errors).toHaveLength(expectedErrors);
    });
  });

  describe("evaluation", () => {
    describe("filtering", () => {
      test("should execute simple day filter on highlights", () => {
        const program = new IpsumFilteringProgramV1();
        program.setProgram('highlights from "1/1/2020" to "2/1/2020"');

        const results = program.evaluate({
          highlights: [
            mock_hl({
              id: "1",
              day: IpsumDay.fromString("12/26/2019", "stored-day"),
            }),
            mock_hl({
              id: "2",
              day: IpsumDay.fromString("1/3/2020", "stored-day"),
            }),
            mock_hl({
              id: "3",
              day: IpsumDay.fromString("1/23/2020", "stored-day"),
            }),
            mock_hl({
              id: "4",
              day: IpsumDay.fromString("2/4/2020", "stored-day"),
            }),
          ],
        });

        expect(results.highlights).toHaveLength(2);
        expect(results.highlights[0].day.toString("stored-day")).toBe(
          "1/23/2020"
        );
        expect(results.highlights[1].day.toString("stored-day")).toBe(
          "1/3/2020"
        );
      });

      test("should execute simple relation filter on highlights", () => {
        const program = new IpsumFilteringProgramV1();
        program.setProgram('highlights which relates to "foo"');

        const results = program.evaluate({
          highlights: [
            mock_hl({
              id: "1",
              outgoingRelations: [
                {
                  predicate: "relates to",
                  objectType: "Arc",
                  objectId: "arc_foo",
                  objectName: "foo",
                },
                {
                  predicate: "is",
                  objectType: "Arc",
                  objectId: "arc_bar",
                  objectName: "bar",
                },
              ],
            }),
            mock_hl({
              id: "2",
              outgoingRelations: [
                {
                  predicate: "relates to",
                  objectType: "Arc",
                  objectId: "arc_bar",
                  objectName: "bar",
                },
              ],
            }),
            mock_hl({
              id: "3",
              outgoingRelations: [
                {
                  predicate: "is",
                  objectType: "Arc",
                  objectId: "arc_foo",
                  objectName: "foo",
                },
              ],
            }),
          ],
        });
        expect(results.highlights).toHaveLength(1);
        expect(results.highlights[0].id).toBe("1");
      });

      test("should execute simple conjunction filter on highlights", () => {
        const program = new IpsumFilteringProgramV1();
        program.setProgram(
          'highlights (which relates to "foo" and which is "bar")'
        );

        const results = program.evaluate({
          highlights: [
            mock_hl({
              id: "1",
              outgoingRelations: [
                {
                  predicate: "relates to",
                  objectType: "Arc",
                  objectId: "arc_foo",
                  objectName: "foo",
                },
                {
                  predicate: "is",
                  objectType: "Arc",
                  objectId: "arc_bar",
                  objectName: "bar",
                },
              ],
            }),
            mock_hl({
              id: "2",
              outgoingRelations: [
                {
                  predicate: "relates to",
                  objectType: "Arc",
                  objectId: "arc_foo",
                  objectName: "foo",
                },
              ],
            }),
            mock_hl({
              id: "3",
              outgoingRelations: [
                {
                  predicate: "is",
                  objectType: "Arc",
                  objectId: "arc_foo",
                  objectName: "foo",
                },
              ],
            }),
          ],
        });
        expect(results.highlights).toHaveLength(1);
        expect(results.highlights[0].id).toBe("1");
      });

      test("should execute simple disjunction filter on highlights", () => {
        const program = new IpsumFilteringProgramV1();
        program.setProgram(
          'highlights (which relates to "foo" or from "1/1/2020" to "2/1/2020")'
        );

        const results = program.evaluate({
          highlights: [
            mock_hl({
              id: "1",
              day: IpsumDay.fromString("12/26/2019", "stored-day"),
              outgoingRelations: [
                {
                  predicate: "relates to",
                  objectType: "Arc",
                  objectId: "arc_foo",
                  objectName: "foo",
                },
              ],
            }),
            mock_hl({
              id: "2",
              day: IpsumDay.fromString("1/3/2020", "stored-day"),
              outgoingRelations: [
                {
                  predicate: "relates to",
                  objectType: "Arc",
                  objectId: "arc_bar",
                  objectName: "bar",
                },
              ],
            }),
          ],
        });
        expect(results.highlights).toHaveLength(2);
        expect(results.highlights[0].id).toBe("2");
        expect(results.highlights[1].id).toBe("1");
      });
    });

    describe("sorting", () => {
      test("should correctly sort by recent first as of today", () => {
        const program = new IpsumFilteringProgramV1();
        program.setProgram('highlights sorted by recent first as of "today"');

        const mockedHls = ["1/4/2020", "1/2/2020", "1/1/2020", "1/7/2020"].map(
          (day) =>
            mock_hl({
              id: `hl_${day}`,
              day: IpsumDay.fromString(day, "stored-day"),
            })
        );

        const results = program.evaluate({ highlights: mockedHls });

        expect(results.highlights).toHaveLength(4);
        expect(results.highlights[0].id).toBe("hl_1/7/2020");
        expect(results.highlights[1].id).toBe("hl_1/4/2020");
        expect(results.highlights[2].id).toBe("hl_1/2/2020");
        expect(results.highlights[3].id).toBe("hl_1/1/2020");
      });

      test("should correctly sort by oldest first as of today", () => {
        const program = new IpsumFilteringProgramV1();
        program.setProgram('highlights sorted by oldest first as of "today"');

        const mockedHls = ["1/4/2020", "1/2/2020", "1/1/2020", "1/7/2020"].map(
          (day) =>
            mock_hl({
              id: `hl_${day}`,
              day: IpsumDay.fromString(day, "stored-day"),
            })
        );

        const results = program.evaluate({ highlights: mockedHls });

        expect(results.highlights).toHaveLength(4);
        expect(results.highlights[0].id).toBe("hl_1/1/2020");
        expect(results.highlights[1].id).toBe("hl_1/2/2020");
        expect(results.highlights[2].id).toBe("hl_1/4/2020");
        expect(results.highlights[3].id).toBe("hl_1/7/2020");
      });

      test("should correctly sort by up for review", () => {
        const program = new IpsumFilteringProgramV1();
        program.setProgram(
          'highlights sorted by review status as of "1/17/2020"'
        );

        const srsCardHl1 = IpsumSRSCard.fromRatings({
          creationDay: IpsumDay.fromString("1/1/2020", "stored-day"),
          ratings: [
            {
              day: IpsumDay.fromString("1/2/2020", "stored-day"),
              rating: 1,
            },
            {
              day: IpsumDay.fromString("1/8/2020", "stored-day"),
              rating: 1,
            },
          ],
        });
        const srsCardHl3 = IpsumSRSCard.fromRatings({
          creationDay: IpsumDay.fromString("1/1/2020", "stored-day"),
          ratings: [
            {
              day: IpsumDay.fromString("1/2/2020", "stored-day"),
              rating: 4,
            },
            {
              day: IpsumDay.fromString("1/8/2020", "stored-day"),
              rating: 5,
            },
          ],
        });

        const mockedHls = [
          mock_hl({
            id: "hl_1",
            srsCard: srsCardHl1,
          }),
          mock_hl({
            id: "hl_2",
            srsCard: null,
          }),
          mock_hl({
            id: "hl_3",
            srsCard: srsCardHl3,
          }),
        ];

        const results = program.evaluate({ highlights: mockedHls });

        expect(srsCardHl1.upForReview(IpsumDay.fromString("1/17/2020"))).toBe(
          true
        );
        expect(srsCardHl3.upForReview(IpsumDay.fromString("1/17/2020"))).toBe(
          false
        );
        expect(results.highlights).toHaveLength(3);
        expect(results.highlights[0].id).toBe("hl_1");
      });
    });
  });

  describe("updating", () => {
    const findNodeWithText = (
      haystack: EndowedNode,
      needle: string
    ): EndowedNode => {
      if (haystack.rawNode.text === needle) {
        return haystack;
      }

      for (const child of haystack.children) {
        const found = findNodeWithText(child, needle);
        if (found) {
          return found;
        }
      }

      return null;
    };

    test.each<{
      input: string;
      expectedOutput: string;
      findNode: (program: IpsumFilteringProgramV1) => EndowedNode;
      newNodeText: string;
    }>([
      {
        input: 'highlights from "1/1/2020" to "2/1/2020"',
        expectedOutput: 'highlights from "2/4/2020" to "5/8/2020"',
        findNode: (program: IpsumFilteringProgramV1) =>
          findNodeWithText(
            program.getEndowedAST(),
            'from "1/1/2020" to "2/1/2020"'
          ),
        newNodeText: 'from "2/4/2020" to "5/8/2020"',
      },
      {
        input: 'highlights (which relates to "foo" and which relates to "bar")',
        expectedOutput:
          'highlights (which relates to "ipsum" and which relates to "bar")',
        findNode: (program: IpsumFilteringProgramV1) =>
          findNodeWithText(program.getEndowedAST(), 'which relates to "foo"'),
        newNodeText: 'which relates to "ipsum"',
      },
      {
        input:
          'highlights (which relates to "foo" and which relates to "bar") sorted by importance as of today',
        expectedOutput:
          'highlights (which relates to "foo" or which relates to "bar") sorted by importance as of today',
        findNode: (program: IpsumFilteringProgramV1) =>
          findNodeWithText(
            program.getEndowedAST(),
            '(which relates to "foo" and which relates to "bar")'
          ),
        newNodeText: '(which relates to "foo" or which relates to "bar")',
      },
      {
        input:
          'highlights which relates to "foo" sorted by importance as of today',
        expectedOutput:
          'highlights which relates to "foo" sorted by recent as of today',
        findNode: (program: IpsumFilteringProgramV1) =>
          findNodeWithText(program.getEndowedAST(), "importance"),
        newNodeText: "recent",
      },
    ])(
      "should update $input to $expectedOutput",
      ({ input, expectedOutput, findNode, newNodeText }) => {
        const program = new IpsumFilteringProgramV1();
        program.setProgram(input);

        const nodeToReplace = findNode(program);

        const newProgram = program.updateNodeText(nodeToReplace, newNodeText);

        expect(newProgram.programString).toBe(expectedOutput);
      }
    );
  });
});
