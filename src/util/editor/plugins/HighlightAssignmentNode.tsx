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
  $getNodeByKey,
  $nodesOfType,
  $selectAll,
  $isElementNode,
  $getRoot,
  $createTextNode,
} from "lexical";
import styles from "./HighlightAssignmentPlugin.less";

export interface HighlightAssignmentNodeAttributes {
  highlightId?: string;
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
  const highlightId = domNode.getAttribute("data-highlight-id");
  const hue = Number.parseInt(domNode.getAttribute("data-hue") ?? "0");

  if (highlightId !== null && highlightId.length && domNode.hasChildNodes()) {
    return {
      node: $createHighlightAssignmentNode({
        highlightId,
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
    const hue = !attributes.highlightId
      ? undefined
      : hueMap[attributes.highlightId] ?? undefined;

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
    if (node.__attributes.highlightId === highlightId) {
      if ($isElementNode(node.getParent())) {
        const children = node.getChildren();
        for (const child of children) {
          node.insertBefore(child);
        }
        node.remove();
      }
    }
  });
  $selectAll();
}

export const isIdenticalHighlight = (
  node1: LexicalNode,
  node2: LexicalNode
) => {
  if (
    !$isHighlightAssignmentNode(node1) ||
    !$isHighlightAssignmentNode(node2)
  ) {
    return false;
  }

  return (
    node1.getAttributes().highlightId === node2.getAttributes().highlightId
  );
};

const nodeHasHighlight = (node: LexicalNode, highlightId: string) => {
  return (
    $isHighlightAssignmentNode(node) &&
    node.getAttributes().highlightId === highlightId
  );
};

/**
 * Determines whether the node is a HighlightAssignmentNode and has if so
 * whether it has an identical highlight ancestor.
 */
export const hasIdenticalHighlightAncestor = (node: LexicalNode) => {
  if (!$isHighlightAssignmentNode(node)) {
    return false;
  }

  if (!node.getParent()) {
    return null;
  }

  let parent = node.getParentOrThrow();
  while (
    parent !== null &&
    parent.getParent() !== null &&
    !nodeHasHighlight(parent, node.getAttributes().highlightId)
  ) {
    parent = parent.getParentOrThrow();
  }

  return parent !== null && parent.getType() !== "root";
};

const printLexicalTreeHelper = (node: LexicalNode, level: number) => {
  const children = $isElementNode(node) ? node.getChildren() : [];
  const indent = " ".repeat(level * 2);
  const highlightId = $isHighlightAssignmentNode(node)
    ? node.__attributes.highlightId
    : "";
  console.log(indent, node.getType(), node.getTextContent(), highlightId);
  children.forEach((child) => {
    printLexicalTreeHelper(child, level + 1);
  });
};

const printLexicalTree = () => {
  const root = $getRoot();

  console.log("----");
  console.log("Root", root.getType(), root.getTextContent());

  const children = root.getChildren();
  children.forEach((child) => {
    printLexicalTreeHelper(child, 1);
  });

  console.log("----");
};

const db = false;

/**
 * This is initially copied directly from the Lexical LinkNode implementation.
 * It handles transforming the editor selection into a new Lexical node tree
 * with highlights properly applied.
 */
export function applyHighlightAssignment(
  attributes: ToggleHighlightAssignmentPayload
) {
  // Highlight assignment invariants:
  // - A highlight should only wrap a TextNode or another highlight.

  const { highlightId } = attributes;
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return;
  }

  // Extract "cuts out" the selected nodes, including parent element nodes.
  const nodes = selection.extract();

  let prevParent: ElementNode | HighlightAssignmentNode | null = null;
  let highlightAssignmentNode: HighlightAssignmentNode | null = null;

  db && printLexicalTree();

  nodes.forEach((selectedNode) => {
    const parent = selectedNode.getParent();

    db &&
      console.log(
        "Node",
        selectedNode.getType(),
        selectedNode.getTextContent(),
        "\t\tParent",
        parent?.getType(),
        parent?.getTextContent()
      );

    if (
      hasIdenticalHighlightAncestor(highlightAssignmentNode) ||
      parent === null ||
      ($isElementNode(selectedNode) && !selectedNode.isInline())
    ) {
      return;
    }

    if (hasIdenticalHighlightAncestor(selectedNode)) {
      return;
    }

    if (!parent.is(prevParent)) {
      prevParent = parent;

      highlightAssignmentNode = $createHighlightAssignmentNode({
        highlightId,
      });

      if (hasIdenticalHighlightAncestor(selectedNode)) {
        if (selectedNode.getPreviousSibling() === null) {
          db &&
            console.log(
              "\t^ create/insert highlight before parent",
              highlightAssignmentNode,
              highlightAssignmentNode.getTextContent()
            );
          parent.insertBefore(highlightAssignmentNode);
        } else {
          db &&
            console.log(
              "\t^ create/insert highlight after parent",
              highlightAssignmentNode,
              highlightAssignmentNode.getTextContent()
            );
          parent.insertAfter(highlightAssignmentNode);
        }
      } else {
        db &&
          console.log(
            "\t^ create/insert highlight before selected node",
            highlightAssignmentNode,
            highlightAssignmentNode.getTextContent()
          );
        selectedNode.insertBefore(highlightAssignmentNode);
      }
    }

    if ($isHighlightAssignmentNode(selectedNode)) {
      // We've found a highlight node with part of the selection inside it. We
      // will bypass this node. Whichever text nodes in this highlight are
      // selected will be wrapped in a nested highlight at another point in the
      // loop.

      return;
    }

    if (highlightAssignmentNode !== null) {
      // Add the selected node to the highlight.
      db && console.log("\t^ appending", selectedNode);
      highlightAssignmentNode.append(selectedNode);
    }
  });

  db && printLexicalTree();
}

export class HighlightAssignmentNode extends ElementNode {
  __attributes: HighlightAssignmentNodeAttributes;

  __hovered = false;

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

  getHovered() {
    return this.__hovered;
  }

  setHovered(hovered: boolean) {
    const writable = this.getWritable();
    writable.__hovered = hovered;
  }

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true
  ): null | ElementNode {
    const highlightNode = $createHighlightAssignmentNode(this.getAttributes());
    highlightNode.append($createTextNode(""));
    this.insertAfter(highlightNode);
    return highlightNode;
  }

  canMergeWith(node: ElementNode): boolean {
    return $isHighlightAssignmentNode(node) && isIdenticalHighlight(this, node);
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  canBeEmpty(): boolean {
    return false;
  }

  isInline(): boolean {
    return true;
  }

  static importJSON(_serializedNode: SerializedHighlightAssignmentNode) {
    const node = $createHighlightAssignmentNode({
      highlightId: _serializedNode.highlightId,
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
      highlightIds: this.__attributes.highlightId,
      hue: this.__attributes.hue,
      type: HighlightAssignmentNode.getType(),
      version: 1,
    };
  }

  addHueStyle(element: HTMLElement) {
    element.classList.add(styles.highlight);
    const hue = this.__attributes.hue;
    hue && element.style.setProperty("--hue", `${hue}`);
    element.style.setProperty("--lightness", `${hue ? "50%" : "0%"}`);
  }

  addHoverStyle(element: HTMLElement) {
    element.classList.add(styles.hovered);
  }

  removeHueStyle(element: HTMLElement) {
    element.classList.remove(styles.highlight);
    element.style.removeProperty("--hue");
    element.style.removeProperty("--lightness");
  }

  removeHoverStyle(element: HTMLElement) {
    element.classList.remove(styles.hovered);
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    if (this.__attributes.highlightId) {
      element.setAttribute("data-highlight-id", this.__attributes.highlightId);
      const hue = this.__attributes.hue;
      hue && element.setAttribute("data-hue", `${hue}`);

      this.addHueStyle(element);
    }
    return element;
  }

  updateDOM(
    _prevNode: HighlightAssignmentNode,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    if (this.__attributes.highlightId) {
      _dom.setAttribute("data-highlight-id", this.__attributes.highlightId);
      if (this.__attributes.hue) {
        _dom.setAttribute("data-hue", `${this.__attributes.hue}`);
        this.addHueStyle(_dom);
      }
    } else {
      _dom.removeAttribute("data-highlight-id");
      _dom.removeAttribute("data-hue");
      _dom.classList.remove(styles.highlight);
      this.removeHueStyle(_dom);
    }

    if (this.getHovered()) {
      this.addHoverStyle(_dom);
    } else {
      this.removeHoverStyle(_dom);
    }

    return false;
  }

  static importDOM(): DOMConversionMap {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-highlight-id")) {
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
