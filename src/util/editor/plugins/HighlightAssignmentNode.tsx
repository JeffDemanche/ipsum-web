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
        ? undefined
        : attributes.highlightIds.reduce((a, c) => a + hueMap[c], 0) /
          attributes.highlightIds.length;

    if (hue && hue !== attributes.hue) {
      if (!isNaN(hue)) {
        node.setAttributes({
          ...attributes,
          hue,
        });
      } else {
        node.setAttributes({
          ...attributes,
          hue: undefined,
        });
      }
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
        const children = node.getChildren();
        for (const child of children) {
          node.insertBefore(child);
        }
        node.remove();
        return;
      }

      node.setAttributes({
        ...node.getAttributes(),
        highlightIds: newHighlightIds,
      });
    }
  });
  $selectAll();
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

  const isIdenticalHighlight = (node1: LexicalNode, node2: LexicalNode) => {
    if (
      !$isHighlightAssignmentNode(node1) ||
      !$isHighlightAssignmentNode(node2)
    ) {
      return false;
    }

    const highlights1 = node1.getAttributes().highlightIds ?? [];
    const highlights2 = node2.getAttributes().highlightIds ?? [];

    return (
      highlights1.length === highlights2.length &&
      highlights1.every((id) => highlights2.includes(id))
    );
  };

  let prevParent: ElementNode | HighlightAssignmentNode | null = null;
  let highlightAssignmentNode: HighlightAssignmentNode | null = null;

  nodes.forEach((selectedNode) => {
    const parent = selectedNode.getParent();

    if (
      isIdenticalHighlight(parent, highlightAssignmentNode) ||
      parent === null ||
      ($isHighlightAssignmentNode(selectedNode) && !selectedNode.isInline())
    ) {
      return;
    }

    if ($isHighlightAssignmentNode(parent)) {
      if (isIdenticalHighlight(parent, highlightAssignmentNode)) {
        return;
      }
    }

    if (!parent.is(prevParent)) {
      prevParent = parent;

      if ($isHighlightAssignmentNode(parent)) {
        highlightAssignmentNode = $createHighlightAssignmentNode({
          highlightIds: [...parent.getAttributes().highlightIds, highlightId],
        });
      } else {
        highlightAssignmentNode = $createHighlightAssignmentNode({
          highlightIds: [highlightId],
        });
      }

      selectedNode.insertBefore(highlightAssignmentNode);
    }

    if ($isHighlightAssignmentNode(selectedNode)) {
      if (selectedNode.is(highlightAssignmentNode)) {
        return;
      }
      // This routine removes the highlight assignment node.
      if (highlightAssignmentNode !== null) {
        const children = selectedNode.getChildren();

        children.forEach((child) => {
          highlightAssignmentNode.append(child);
        });
      }

      selectedNode.remove();
      return;
    }

    if (highlightAssignmentNode !== null) {
      highlightAssignmentNode.append(selectedNode);
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
      const hue = this.__attributes.hue;
      hue && element.setAttribute("data-hue", `${hue}`);
      element.classList.add(styles.highlight);
      hue && element.style.setProperty("--hue", `${hue}`);
      element.style.setProperty("--lightness", `${hue ? "50%" : "0%"}`);
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
