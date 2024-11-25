import { Button } from "components/atoms/Button";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useRef, useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";
import { addHighlightsSort } from "./filter-tree-actions";
import { NewFilterExpressionPopover } from "./NewFilterExpressionPopover";

export const Node_filter_expression_highlights: NodeComponent = ({
  editMode,
  endowedNode,
  performAction,
  transformProgram,
  childComponents,
  relationChooserProps,
}: NodeComponentProps) => {
  const [showAddFilterPopover, setShowAddFilterPopover] = useState(false);
  const addFilterPopoverRef = useRef<HTMLButtonElement>();

  const addFilterPopover = (
    <NewFilterExpressionPopover
      show={showAddFilterPopover}
      setShow={setShowAddFilterPopover}
      anchorEl={addFilterPopoverRef.current}
      relationChooserProps={relationChooserProps}
      onCreateDatesFilter={() => {
        setShowAddFilterPopover(false);
        const sortChild = endowedNode.children.find(
          (child) => child.type === "sort_expression_highlights"
        );
        if (!sortChild) {
          transformProgram((program) =>
            program.updateNodeText(
              endowedNode,
              `${endowedNode.rawNode.text} from "beginning" to "today"`
            )
          );
        } else {
          transformProgram((program) =>
            program.updateNodeText(
              endowedNode,
              `highlights from "beginning" to "today" ${sortChild.rawNode.text}`
            )
          );
        }
      }}
      onRelationChoose={(relation) => {
        transformProgram((program) =>
          program.updateNodeText(
            endowedNode,
            `${endowedNode.rawNode.text} which ${relation.predicate} "${relation.objectId}"`
          )
        );
        setShowAddFilterPopover(null);
      }}
    />
  );

  const showAddFilter = !endowedNode.children.some(
    (child) => child.type === "highlights_expression"
  );

  const addFilter = showAddFilter ? (
    <Button
      variant="link"
      ref={addFilterPopoverRef}
      style={{ fontSize: font_size_x_small, color: grey600 }}
      onClick={() => {
        setShowAddFilterPopover(true);
      }}
    >
      + filter
    </Button>
  ) : null;

  const showAddSort = !endowedNode.children.some(
    (child) => child.type === "sort_expression_highlights"
  );

  const addSort = showAddSort ? (
    <Button
      variant="link"
      onClick={() => {
        performAction(addHighlightsSort, { defaultSortType: "review status" });
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      + sort
    </Button>
  ) : null;

  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="block">
      {childComponents}
      {addFilter}
      {addFilterPopover} {addSort}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
