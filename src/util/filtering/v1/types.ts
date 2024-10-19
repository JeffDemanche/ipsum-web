interface EndowedNodeBase {
  children: EndowedNode[];
}

interface EN_ifl extends EndowedNodeBase {
  type: "ifl";
}

interface EN_filter extends EndowedNodeBase {
  type: "filter";
}

interface EN_undefined extends EndowedNodeBase {
  type: "undefined";
}

export type EndowedNode = EN_ifl | EN_filter | EN_undefined;
