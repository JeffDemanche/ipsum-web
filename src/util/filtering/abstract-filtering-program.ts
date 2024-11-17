import { Grammars, IToken } from "ebnf";

export abstract class IpsumFilteringProgram {
  private __bnfString: string;
  private __bnfParser: Grammars.W3C.Parser;

  constructor(bnfString: string) {
    this.__bnfString = bnfString;
    this.__bnfParser = new Grammars.W3C.Parser(bnfString, {
      keepUpperRules: true,
    });
  }

  createAst(text: string, { debugAst = false }): IToken {
    let result: IToken;

    try {
      result = this.__bnfParser.getAST(text);
    } catch (e) {
      console.error(e);
    }

    if (debugAst) {
      printAST(result);
    }

    return result;
  }

  abstract updateNodeText(
    node: unknown,
    newNodeText: string
  ): IpsumFilteringProgram;

  abstract get programString(): string;

  abstract setProgram(program: string): this;

  abstract generateEndowedAST(): unknown;

  abstract getEndowedAST(): unknown;

  abstract evaluate(evaluationSet: unknown): unknown;
}

function printAST(token: IToken, level = 0) {
  console.log(
    "         " +
      "  ".repeat(level) +
      `|-${token.type}${token.children.length == 0 ? "=" + token.text : ""}`
  );
  token.children &&
    token.children.forEach((c) => {
      printAST(c, level + 1);
    });
}
