interface V1EndowedNodeBase {
  children: V1EndowedNode[];
}

interface EN_ifl extends V1EndowedNodeBase {
  type: "ifl";
}

interface EN_filter extends V1EndowedNodeBase {
  type: "filter";
}

interface EN_undefined extends V1EndowedNodeBase {
  type: "undefined";
}

export type V1EndowedNode = EN_ifl | EN_filter | EN_undefined;
