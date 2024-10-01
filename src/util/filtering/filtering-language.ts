import { Grammars, IToken } from "ebnf";

import { ebnf as v1Ebnf } from "./versions/v1-definition";

export class IpsumFilteringLanguage {
  private __bnfString: string;
  private __bnfParser: Grammars.W3C.Parser;

  constructor(bnfString: string) {
    this.__bnfString = bnfString;
    this.__bnfParser = new Grammars.W3C.Parser(bnfString, {
      keepUpperRules: true,
    });
  }

  getAst(text: string, { debugAst = false }): IToken {
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

type IFLVersion = "v1";

export const getVersion = (version: IFLVersion) => {
  switch (version) {
    case "v1":
      return new IpsumFilteringLanguage(v1Ebnf);
  }
};
