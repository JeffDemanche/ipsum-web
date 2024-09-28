import { getVersion } from "../filtering-language";

describe("IpsumFilterLanguage V1", () => {
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

  describe("parsing validity", () => {
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
});
