import { Button } from "components/atoms/Button";
import React, { useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_relation_object: NodeComponent = ({
  editMode,
  endowedNode,
  relationChooserProps,
  childComponents,
}: NodeComponentProps) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <ChildrenContainer node={endowedNode} layout="inline">
      <Button variant="link">{endowedNode.rawNode.text}</Button>{" "}
    </ChildrenContainer>
  );
};
