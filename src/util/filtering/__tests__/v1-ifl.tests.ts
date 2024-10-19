import { IpsumDay } from "util/dates";

import { getVersion } from "../filtering-language";
import { FilterableHighlight, IpsumFilteringProgramV1 } from "../v1/program";

const mock_hl = (mock: Partial<FilterableHighlight>): FilterableHighlight => {
  return {
    type: "highlight",
    day: IpsumDay.fromString("1/1/2020", "stored-day"),
    ...mock,
  };
};

describe("IpsumFilterLanguage V1", () => {
  describe("parsing", () => {
    it("should build AST from simple string", () => {
      const ifl = getVersion("v1");

      const ast = ifl.getAst("highlights", {});

      expect(ast.errors).toHaveLength(0);
    });

    it("should return error when parsing simple invalid string", () => {
      const ifl = getVersion("v1");

      const ast = ifl.getAst("highlights bad", {});

      expect(ast.errors).toHaveLength(1);
      expect(ast.errors[0].message).toBe("Unexpected end of input: \n bad");
    });

    it("should validate simple highlight filter expression", () => {
      const ifl = getVersion("v1");

      const ast = ifl.getAst('highlights from "1" to "2"', {});

      expect(ast.errors).toHaveLength(0);
    });

    it("should validate conjuction", () => {
      const ifl = getVersion("v1");

      const ast = ifl.getAst(
        'highlights (which are "1" and from "1" to "2")',
        {}
      );

      expect(ast.errors).toHaveLength(0);
    });

    it.each([
      ['highlights from "1" to "2"', 0],
      ['highlights which are "1"', 0],
      ['highlights which relate to "1"', 0],
      ['highlights (which relate to "1" and which relate to "2")', 0],
      [
        'highlights (which relate to "1" and which relate to "2" and which relate to "3")',
        0,
      ],
      ['highlights (which relate to "1" or which relate to "2")', 0],
      [
        'highlights (from "1" to "2" and (which relate to "2" or which relate to "3"))',
        0,
      ],
      ["highlights sorted by importance", 0],
      ['highlights sorted by importance as of "1"', 0],
      ["highlights sorted by recent", 0],
      ['highlights sorted by recent as of "1"', 0],
      [
        'highlights (from "1" to "2" and which relate to "3") sorted by recent as of "1"',
        0,
      ],
    ])("should be valid: `%s`", (text, expectedErrors) => {
      const ifl = getVersion("v1");

      const ast = ifl.getAst(text, {});

      expect(ast.errors).toHaveLength(expectedErrors);
    });
  });

  describe("execution", () => {
    it("should execute simple day filter on highlights", () => {
      const program = new IpsumFilteringProgramV1(
        'highlights from "1/1/2020" to "2/1/2020"'
      );

      const results = program.evaluate({
        highlights: [
          mock_hl({
            type: "highlight",
            day: IpsumDay.fromString("12/26/2019", "stored-day"),
          }),
          mock_hl({
            type: "highlight",
            day: IpsumDay.fromString("1/3/2020", "stored-day"),
          }),
          mock_hl({
            type: "highlight",
            day: IpsumDay.fromString("1/23/2020", "stored-day"),
          }),
          mock_hl({
            type: "highlight",
            day: IpsumDay.fromString("2/4/2020", "stored-day"),
          }),
        ],
      });

      expect(results.highlights).toHaveLength(2);
      expect(results.highlights[0].day.toString("stored-day")).toBe("1/3/2020");
      expect(results.highlights[1].day.toString("stored-day")).toBe(
        "1/23/2020"
      );
    });

    it("should execute simple relation filter on highlights", () => {
      // const program = new IpsumFilteringProgramV1(
      //   'highlights which relate to "foo"'
      // );
      // const results = program.evaluate({
      //   highlights: [
      //     mock_hl({
      //       type: "highlight",
      //       relation: "bar",
      //     }),
      //     mock_hl({
      //       type: "highlight",
      //       relation: "foo",
      //     }),
      //     mock_hl({
      //       type: "highlight",
      //       relation: "baz",
      //     }),
      //   ],
      // });
      // expect(results.highlights).toHaveLength(1);
      // expect(results.highlights[0].relation).toBe("foo");
    });
  });
});
