import {
  $applyNodeReplacement,
  EditorConfig,
  LexicalNode,
  NodeKey,
  DOMConversionMap,
  Spread,
  DOMConversionOutput,
  ElementNode,
  SerializedElementNode,
  $getSelection,
  $isRangeSelection,
  RangeSelection,
  $createParagraphNode,
  $getNodeByKey,
  $nodesOfType,
  $isRootNode,
  $getRoot,
  $createTextNode,
  $selectAll,
  $setSelection,
  $createNodeSelection,
  $createRangeSelection,
} from "lexical";
import {} from "@lexical/utils";
import styles from "./HighlightAssignmentPlugin.less";

export interface HighlightAssignmentNodeAttributes {
  highlightIds?: string[];
  hue?: number;
}

export interface ToggleHighlightAssignmentPayload {
  highlightId: string;
}

export type SerializedHighlightAssignmentNode = Spread<
  HighlightAssignmentNodeAttributes,
  SerializedElementNode
>;

export function $createHighlightAssignmentNode(
  attributes?: HighlightAssignmentNodeAttributes
): HighlightAssignmentNode {
  return $applyNodeReplacement(new HighlightAssignmentNode(attributes));
}

export function $isHighlightAssignmentNode(
  node: LexicalNode | null | undefined
): node is HighlightAssignmentNode {
  return node instanceof HighlightAssignmentNode;
}

function convertHighlightAssignmentElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const highlightIds = domNode.getAttribute("data-highlight-ids")?.split(",");
  const hue = Number.parseInt(domNode.getAttribute("data-hue") ?? "0");

  if (highlightIds !== null && highlightIds.length && domNode.hasChildNodes()) {
    return {
      node: $createHighlightAssignmentNode({
        highlightIds,
        hue,
      }),
    };
  }

  return null;
}

export function $getAncestor<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
    parent = parent.getParentOrThrow();
  }
  return predicate(parent) ? parent : null;
}

export function fixHues(nodeKey: string, hueMap: Record<string, number>) {
  const node = $getNodeByKey(nodeKey);
  if ($isHighlightAssignmentNode(node)) {
    const attributes = node.getAttributes();
    const hue =
      attributes.highlightIds.length === 0
        ? 0
        : attributes.highlightIds.reduce((a, c) => a + hueMap[c], 0) /
          attributes.highlightIds.length;

    if (!isNaN(hue) && hue !== attributes.hue) {
      node.setAttributes({
        ...attributes,
        hue,
      });
    }
  }
}

export function removeHighlightAssignmentFromEditor(highlightId: string) {
  const highlightAssignmentNodes = $nodesOfType(HighlightAssignmentNode);

  if (highlightAssignmentNodes.length === 0) {
    return;
  }

  highlightAssignmentNodes.forEach((node) => {
    if (node.__attributes.highlightIds.includes(highlightId)) {
      const newHighlightIds = node.__attributes.highlightIds.filter(
        (id) => id !== highlightId
      );

      if (newHighlightIds.length === 0) {
        // TODO: merge node back if no more highlightIds
        const newNode = $createTextNode(node.getTextContent());
        console.log(node);

        const paragraph = $createParagraphNode();
        paragraph.append(newNode);
        node.replace(paragraph);

        $selectAll();
        return;
      }

      node.setAttributes({
        ...node.getAttributes(),
        highlightIds: newHighlightIds,
      });
    }
  });
}

/**
 * This is initially copied directly from the Lexical LinkNode implementation.
 * It handles transforming the editor selection into a new Lexical node tree
 * with highlights properly applied.
 */
export function toggleHighlightAssignment(
  attributes: ToggleHighlightAssignmentPayload | null
) {
  const { highlightId } = attributes;
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return;
  }

  const nodes = selection.extract();

  // Un-highlight
  if (attributes === null) {
    nodes.forEach((node) => {
      const parent = node.getParent();

      if ($isHighlightAssignmentNode(parent)) {
        const children = parent.getChildren();

        children.forEach((child) => {
          parent.insertBefore(child);
        });

        parent.remove();
      }
    });
  }
  // Add/merge highlight
  else {
    const firstNode = nodes[0];
    const highlightNode = $getAncestor(firstNode, $isHighlightAssignmentNode);
    if (highlightNode !== null) {
      highlightNode.addHighlightId(highlightId);
    }
  }

  let prevParent: ElementNode | HighlightAssignmentNode | null = null;
  let highlightAssignmentNode: HighlightAssignmentNode | null = null;

  nodes.forEach((node) => {
    const parent = node.getParent();

    if (
      parent === highlightAssignmentNode ||
      parent === null ||
      ($isHighlightAssignmentNode(node) && !node.isInline())
    ) {
      return;
    }

    if ($isHighlightAssignmentNode(parent)) {
      highlightAssignmentNode = parent;
      parent.setAttributes({ highlightIds: [highlightId] });
      return;
    }

    if (!parent.is(prevParent)) {
      prevParent = parent;
      highlightAssignmentNode = $createHighlightAssignmentNode({
        highlightIds: [highlightId],
      });

      if ($isHighlightAssignmentNode(parent)) {
        if (node.getPreviousSibling() === null) {
          parent.insertBefore(highlightAssignmentNode);
        } else {
          parent.insertAfter(highlightAssignmentNode);
        }
      } else {
        node.insertBefore(highlightAssignmentNode);
      }
    }

    if ($isHighlightAssignmentNode(node)) {
      if (node.is(highlightAssignmentNode)) {
        return;
      }
      if (highlightAssignmentNode !== null) {
        const children = node.getChildren();

        children.forEach((child) => {
          highlightAssignmentNode.append(child);
        });
      }

      node.remove();
      return;
    }

    if (highlightAssignmentNode !== null) {
      highlightAssignmentNode.append(node);
    }
  });
}

export class HighlightAssignmentNode extends ElementNode {
  __attributes: HighlightAssignmentNodeAttributes;

  constructor(attributes: HighlightAssignmentNodeAttributes, key?: NodeKey) {
    super(key);

    this.__attributes = attributes;
  }

  getAttributes(): HighlightAssignmentNodeAttributes {
    return this.__attributes;
  }

  setAttributes(attributes: HighlightAssignmentNodeAttributes) {
    const writable = this.getWritable();
    writable.__attributes = attributes;
  }

  addHighlightId(highlightId: string) {
    const writable = this.getWritable();
    const highlightIds = writable.__attributes.highlightIds ?? [];
    writable.__attributes.highlightIds = [...highlightIds, highlightId];
  }

  // insertNewAfter(
  //   _: RangeSelection,
  //   restoreSelection = true
  // ): null | ElementNode {
  //   const newElement = $createParagraphNode();
  //   newElement.append($createHighlightAssignmentNode(this.__attributes));
  //   const direction = this.getDirection();
  //   newElement.setDirection(direction);
  //   this.insertAfter(newElement, restoreSelection);
  //   return newElement;
  // }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  canBeEmpty(): boolean {
    return false;
  }

  static importJSON(_serializedNode: SerializedHighlightAssignmentNode) {
    const node = $createHighlightAssignmentNode({
      highlightIds: _serializedNode.highlightIds,
      hue: _serializedNode.hue,
    });

    node.setFormat(_serializedNode.format);
    node.setIndent(_serializedNode.indent);
    node.setDirection(_serializedNode.direction);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      highlightIds: this.__attributes.highlightIds,
      hue: this.__attributes.hue,
      type: HighlightAssignmentNode.getType(),
      version: 1,
    };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    if (this.__attributes.highlightIds?.length) {
      element.setAttribute(
        "data-highlight-ids",
        this.__attributes.highlightIds.join(",")
      );
      element.setAttribute("data-hue", `${this.__attributes.hue ?? 0}`);
      element.classList.add(styles.highlight);
      element.style.setProperty("--hue", `${this.__attributes.hue ?? 0}`);
      element.style.setProperty(
        "--lightness",
        `${this.__attributes.hue !== undefined ? "50%" : "0%"}`
      );
    }
    return element;
  }

  updateDOM(
    _prevNode: HighlightAssignmentNode,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    if (
      this.__attributes.highlightIds !== _prevNode.__attributes.highlightIds
    ) {
      if (this.__attributes.highlightIds) {
        _dom.setAttribute(
          "data-highlight-ids",
          this.__attributes.highlightIds.join(",")
        );
        _dom.setAttribute("data-hue", `${this.__attributes.hue}`);
      } else {
        _dom.removeAttribute("data-highlight-ids");
        _dom.removeAttribute("data-hue");
        _dom.classList.remove(styles.highlight);
      }
    }

    return false;
  }

  static importDOM(): DOMConversionMap {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-highlight-ids")) {
          return null;
        }
        return {
          conversion: convertHighlightAssignmentElement,
          priority: 1,
        };
      },
    };
  }

  static clone(_data: HighlightAssignmentNode): HighlightAssignmentNode {
    return new HighlightAssignmentNode(_data.__attributes);
  }

  static getType(): string {
    return "highlight-assignment";
  }
}
