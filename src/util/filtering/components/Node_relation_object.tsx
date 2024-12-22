import { ArcTag } from "components/molecules/ArcTag";
import React from "react";

import type { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_relation_object: NodeComponent = ({
  endowedNode,
  arcByIdOrName,
  onArcClick,
}: NodeComponentProps) => {
  const idOrName = endowedNode.rawNode.text.slice(1, -1);

  const arc = arcByIdOrName(idOrName) ?? {
    id: "",
    name: "(arc not found)",
    color: 0,
  };

  return (
    <ChildrenContainer node={endowedNode} layout="inline">
      <span>
        <ArcTag
          fontSize="x-small"
          text={arc.name}
          hue={arc.color}
          onClick={() => {
            onArcClick(arc.id);
          }}
        ></ArcTag>
      </span>{" "}
    </ChildrenContainer>
  );
};
