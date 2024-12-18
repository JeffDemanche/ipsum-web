import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";

import { CommentLabelNode } from "./CommentLabelNode";

interface IpsumCommentNodeAttributes {
  commentId: string;
  commentHighlightHue: number;
  commentHighlightObjectText: string;
  commentHighlightNumber: string;
}

export type SerializedIpsumCommentNode = Spread<
  IpsumCommentNodeAttributes,
  SerializedElementNode
>;

export function $createIpsumCommentNode(
  attributes: IpsumCommentNodeAttributes,
  key?: NodeKey
) {
  const commentNode = new IpsumCommentNode(attributes, key);
  const labelNode = new CommentLabelNode(attributes);
  commentNode.append(labelNode);
  return $applyNodeReplacement(commentNode);
}

export function $isIpsumCommentNode(
  node: LexicalNode
): node is IpsumCommentNode {
  return node instanceof IpsumCommentNode;
}

function convertIpsumCommentNode(domNode: HTMLElement): DOMConversionOutput {
  const commentId = domNode.getAttribute("data-comment-id");
  const commentHighlightHue = Number.parseInt(
    domNode.getAttribute("data-hue") ?? "0"
  );
  const commentHighlightNumber = domNode.getAttribute("data-number") ?? "";
  const commentHighlightObjectText =
    domNode.getAttribute("data-object-text") ?? "";

  if (commentId && commentId.length && domNode.hasChildNodes())
    return {
      node: $createIpsumCommentNode({
        commentId,
        commentHighlightHue,
        commentHighlightNumber,
        commentHighlightObjectText,
      }),
    };
}

export class IpsumCommentNode extends ElementNode {
  __attributes: IpsumCommentNodeAttributes;

  constructor(attributes: IpsumCommentNodeAttributes, key?: NodeKey) {
    super(key);

    this.__attributes = attributes;
  }

  get commentId(): string {
    return this.__attributes.commentId;
  }

  get commentHighlightHue(): number {
    return this.__attributes.commentHighlightHue;
  }

  canBeEmpty(): boolean {
    return false;
  }

  isInline(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return true;
  }

  canInsertTextBefore(): boolean {
    return true;
  }

  addStyle(element: HTMLElement): void {
    element.classList.add("ipsum-comment");

    const hue = this.__attributes.commentHighlightHue;
    hue && element.style.setProperty("--hue", `${hue}`);
    element.style.setProperty("--lightness", `${hue ? "95%" : "0%"}`);
  }

  removeStyle(element: HTMLElement): void {
    element.classList.remove("ipsum-comment");
    element.style.removeProperty("--hue");
    element.style.removeProperty("--lightness");
  }

  static importJSON(_serializedNode: SerializedIpsumCommentNode): LexicalNode {
    const node = $createIpsumCommentNode({
      commentId: _serializedNode.commentId,
      commentHighlightHue: _serializedNode.commentHighlightHue,
      commentHighlightNumber: _serializedNode.commentHighlightNumber,
      commentHighlightObjectText: _serializedNode.commentHighlightObjectText,
    });

    node.setFormat(_serializedNode.format);
    node.setIndent(_serializedNode.indent);
    node.setDirection(_serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      ...this.__attributes,
    };
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const element = document.createElement("div");

    if (this.__attributes.commentId) {
      element.setAttribute("data-comment-id", this.__attributes.commentId);
      element.setAttribute(
        "data-number",
        this.__attributes.commentHighlightNumber
      );
      element.setAttribute(
        "data-object-text",
        this.__attributes.commentHighlightObjectText
      );

      const hue = this.__attributes.commentHighlightHue;
      hue && element.setAttribute("data-hue", `${hue}`);

      this.addStyle(element);
    }
    return element;
  }

  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    if (this.__attributes.commentId) {
      _dom.setAttribute("data-comment-id", this.__attributes.commentId);
      const hue = this.__attributes.commentHighlightHue;
      hue && _dom.setAttribute("data-hue", `${hue}`);

      this.addStyle(_dom);
    } else {
      _dom.removeAttribute("data-comment-id");
      _dom.removeAttribute("data-hue");

      this.removeStyle(_dom);
    }

    return false;
  }

  static importDOM(): DOMConversionMap {
    return {
      div: (domNode: HTMLElement) => {
        if (
          !domNode.hasAttribute("data-comment-id") ||
          domNode.textContent === ""
        )
          return null;

        return {
          conversion: convertIpsumCommentNode,
          priority: 1,
        };
      },
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    return {
      after: (element: HTMLElement) => {
        // Remove the comment label markup
        if (element instanceof HTMLElement) {
          const labelElement = element.querySelector("[data-comment-label]");
          labelElement?.remove();
        }
        return element;
      },
      element: this.createDOM(editor._config, editor),
    };
  }

  static clone(_data: IpsumCommentNode): IpsumCommentNode {
    return new IpsumCommentNode(_data.__attributes, _data.__key);
  }

  static getType(): string {
    return "ipsum-comment-node";
  }
}
