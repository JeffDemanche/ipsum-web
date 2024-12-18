import { hueSwatch } from "components/styles";
import {
  DecoratorNode,
  LexicalNode,
  SerializedElementNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import React, { ReactNode } from "react";

interface CommentLabelProps {
  commentHighlightHue: number;
  commentHighlightObjectText: string;
  commentHighlightNumber: string;
}

const CommentLabel: React.FunctionComponent<CommentLabelProps> = ({
  commentHighlightHue,
  commentHighlightNumber,
  commentHighlightObjectText,
}) => {
  return (
    <div
      style={{
        backgroundColor: hueSwatch(commentHighlightHue, "light_background"),
      }}
    >
      {commentHighlightObjectText}
      <sup>{commentHighlightNumber}</sup>
    </div>
  );
};

export type SerializedIpsumCommentLabelNode = Spread<
  CommentLabelNodeAttributes,
  SerializedElementNode
>;

interface CommentLabelNodeAttributes {
  commentHighlightHue: number;
  commentHighlightObjectText: string;
  commentHighlightNumber: string;
}

export class CommentLabelNode extends DecoratorNode<ReactNode> {
  private __attributes: CommentLabelNodeAttributes;

  static getType() {
    return "comment-label";
  }

  static clone(node: CommentLabelNode) {
    return new CommentLabelNode(node.__attributes, node.__key);
  }

  static importJSON(
    _serializedNode: SerializedIpsumCommentLabelNode
  ): LexicalNode {
    const node = $createCommentLabelNode({
      commentHighlightHue: _serializedNode.commentHighlightHue,
      commentHighlightNumber: _serializedNode.commentHighlightNumber,
      commentHighlightObjectText: _serializedNode.commentHighlightObjectText,
    });
    return node;
  }

  constructor(attributes: CommentLabelNodeAttributes, key?: string) {
    super(key);

    this.__attributes = attributes;
  }

  isKeyboardSelectable(): boolean {
    return false;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.setAttribute("data-comment-label", "");
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <CommentLabel {...this.__attributes} />;
  }

  exportJSON(): SerializedLexicalNode {
    return {
      ...super.exportJSON(),
      ...this.__attributes,
    };
  }
}

export const $createCommentLabelNode = (
  attributes: CommentLabelNodeAttributes
) => {
  return new CommentLabelNode(attributes);
};

export const $isCommentLabelNode = (
  node: LexicalNode
): node is CommentLabelNode => {
  return node instanceof CommentLabelNode;
};
