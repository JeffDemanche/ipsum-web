import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";

interface IpsumCommentNodeAttributes {
  commentId: string;
  commentHighlightHue: number;
}

export type SerializedIpsumCommentNode = Spread<
  IpsumCommentNodeAttributes,
  SerializedElementNode
>;

export function $createIpsumCommentNode(
  attributes: IpsumCommentNodeAttributes,
  key?: NodeKey
) {
  return $applyNodeReplacement(new IpsumCommentNode(attributes, key));
}

function convertIpsumCommentNode(domNode: HTMLElement): DOMConversionOutput {
  const commentId = domNode.getAttribute("data-comment-id");
  const commentHighlightHue = Number.parseInt(
    domNode.getAttribute("data-hue") ?? "0"
  );

  if (commentId && commentId.length && domNode.hasChildNodes())
    return {
      node: $createIpsumCommentNode({
        commentId,
        commentHighlightHue,
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

  static importJSON(_serializedNode: SerializedIpsumCommentNode): LexicalNode {
    const node = $createIpsumCommentNode({
      commentId: _serializedNode.commentId,
      commentHighlightHue: _serializedNode.commentHighlightHue,
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
      const hue = this.__attributes.commentHighlightHue;
      hue && element.setAttribute("data-hue", `${hue}`);
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
    } else {
      _dom.removeAttribute("data-comment-id");
      _dom.removeAttribute("data-hue");
    }

    return false;
  }

  static importDOM(): DOMConversionMap {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-comment-id")) return null;

        return {
          conversion: convertIpsumCommentNode,
          priority: 1,
        };
      },
    };
  }

  static clone(_data: IpsumCommentNode): IpsumCommentNode {
    return new IpsumCommentNode(_data.__attributes, _data.__key);
  }

  static getType(): string {
    return "ipsum-comment-node";
  }
}
