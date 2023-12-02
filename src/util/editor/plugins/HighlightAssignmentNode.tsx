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
} from "lexical";
import {} from "@lexical/utils";
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

export const ancestorWithHighlight = (
  node: LexicalNode,
  highlightId: string
) => {
  if (!node.getParent()) {
    return null;
  }

  let parent = node.getParentOrThrow();
  while (
    parent !== null &&
    parent.getParent() !== null &&
    !nodeHasHighlight(parent, highlightId)
  ) {
    parent = parent.getParentOrThrow();
  }
  return nodeHasHighlight(parent, highlightId) ? parent : null;
};

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

  // const highlightNode = $createHighlightAssignmentNode(attributes);

  // const nodes = selection.extract();

  // highlightNode.append(...nodes);

  // console.log($getSelection());

  // // highlightNode.append(...nodes);

  // $insertNodes([highlightNode]);

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

      highlightAssignmentNode = $createHighlightAssignmentNode({
        highlightId,
      });

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

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true
  ): null | ElementNode {
    const element = this.getParentOrThrow().insertNewAfter(
      selection,
      restoreSelection
    );
    if ($isElementNode(element)) {
      const highlightNode = $createHighlightAssignmentNode(
        this.getAttributes()
      );
      element.append(highlightNode);
      return highlightNode;
    }
    return null;
  }

  canMergeWith(node: ElementNode): boolean {
    return $isHighlightAssignmentNode(node) && isIdenticalHighlight(this, node);
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): true {
    return true;
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

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    if (this.__attributes.highlightId) {
      element.setAttribute("data-highlight-id", this.__attributes.highlightId);
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
    if (this.__attributes.highlightId !== _prevNode.__attributes.highlightId) {
      if (this.__attributes.highlightId) {
        _dom.setAttribute("data-highlight-id", this.__attributes.highlightId);
        _dom.setAttribute("data-hue", `${this.__attributes.hue}`);
      } else {
        _dom.removeAttribute("data-highlight-id");
        _dom.removeAttribute("data-hue");
        _dom.classList.remove(styles.highlight);
      }
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
