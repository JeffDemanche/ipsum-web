import { Button } from "components/atoms/Button";
import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import { Type } from "components/atoms/Type";
import { font_size_x_small, grey600 } from "components/styles";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_filter: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  transformProgram,
}: NodeComponentProps) => {
  const filterType = endowedNode.children[0].type;

  const filterTypeOptions = ["highlights", "arcs"];

  const value =
    filterType === "filter_expression_highlights" ? "highlights" : "arcs";

  const onFilterTypeChange = (newType: string) => {
    transformProgram((program) => program.updateNodeText(endowedNode, newType));
  };

  const showAddSort =
    filterType === "filter_expression_highlights" &&
    !endowedNode.children.some(
      (child) => child.type === "sort_expression_highlights"
    );

  const showRemoveSort =
    filterType === "filter_expression_highlights" &&
    endowedNode.children.some(
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

  const removeSort = showRemoveSort ? (
    <Button
      variant="link"
      onClick={() => {
        transformProgram((program) =>
          program.updateNodeText(
            endowedNode.children.find(
              (child) => child.type === "sort_expression_highlights"
            ),
            ""
          )
        );
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      - sort
    </Button>
  ) : null;

  const editModeMarkup = (
    <>
      <Select value={value} variant="text">
        {filterTypeOptions.map((type) => (
          <MenuItem
            key={type}
            value={type}
            onClick={() => {
              onFilterTypeChange(type);
            }}
          >
            {type}
          </MenuItem>
        ))}
      </Select>{" "}
      {childComponents}
      {addSort}
      {removeSort}
    </>
  );

  if (
    filterType !== "filter_expression_highlights" &&
    filterType !== "filter_expression_arcs"
  ) {
    return <Type>Invalid filter type</Type>;
  }

  const nonEditModeMarkup = (
    <Type weight="light" size="small">
      {childComponents}
    </Type>
  );

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
