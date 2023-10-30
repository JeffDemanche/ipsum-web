import { NodeKey, TextNode } from "lexical";

export class HighlightAssignmentNode extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  static getType(): string {
    return "highlight-assignment";
  }
}
