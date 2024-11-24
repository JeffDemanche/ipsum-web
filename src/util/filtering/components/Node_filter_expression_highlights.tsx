import { Button } from "components/atoms/Button";
import { MenuItem } from "components/atoms/MenuItem";
import { Popover } from "components/atoms/Popover";
import { RelationChooser } from "components/molecules/RelationChooser";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useRef, useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_filter_expression_highlights: NodeComponent = ({
  editMode,
  endowedNode,
  transformProgram,
  childComponents,
  relationChooserProps,
}: NodeComponentProps) => {
  const [showAddFilterPopover, setShowAddFilterPopover] = useState(false);
  const addFilterPopoverRef = useRef<HTMLButtonElement>();

  const [choosingRelation, setChoosingRelation] = useState(false);

  const addFilterPopover = (
    <Popover
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={() => {
        setShowAddFilterPopover(false);
        setChoosingRelation(false);
      }}
      anchorEl={addFilterPopoverRef.current}
      open={showAddFilterPopover}
    >
      {choosingRelation ? (
        <RelationChooser
          {...relationChooserProps}
          onRelationChoose={(relation) => {
            transformProgram((program) =>
              program.updateNodeText(
                endowedNode,
                `${endowedNode.rawNode.text} which ${relation.predicate} "${relation.objectId}"`
              )
            );
            setShowAddFilterPopover(null);
            setChoosingRelation(false);
          }}
          maxArcResults={5}
        />
      ) : (
        <>
          <MenuItem
            onClick={() => {
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
          >
            by dates
          </MenuItem>
          <MenuItem
            onClick={() => {
              setChoosingRelation(true);
            }}
          >
            by relation
          </MenuItem>
        </>
      )}
    </Popover>
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
        transformProgram((program) =>
          program.updateNodeText(
            endowedNode,
            `${endowedNode.rawNode.text} sorted by importance as of "today"`
          )
        );
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
