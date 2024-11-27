import { IpsumFilteringProgramV1 } from "../ipsum-filtering-program-v1";
import { EndowedNode, FilterType, SortType } from "../types";

export type FilterTreeAction<T> = ({
  program,
  args,
}: {
  program: IpsumFilteringProgramV1;
  args: T;
}) => IpsumFilteringProgramV1;

export const addHighlightsSort: FilterTreeAction<{
  defaultSortType?: SortType;
}> = ({ program, args }) => {
  const existingSortExpressionHighlights = program.findEndowedNodesByType(
    "sort_expression_highlights"
  );

  if (existingSortExpressionHighlights?.length > 0) {
    throw new Error(
      "Filtering program action error: highlights sort already exists"
    );
  }

  const filterExpressionHighlights = program.findEndowedNodesByType(
    "filter_expression_highlights"
  )[0];

  if (!filterExpressionHighlights) {
    return program;
  }

  return program.updateNodeText(
    filterExpressionHighlights,
    `${filterExpressionHighlights.rawNode.text} sorted by ${args.defaultSortType ?? "review status"} as of "today"`
  );
};

export const removeHighlightsSort: FilterTreeAction<Record<string, never>> = ({
  program,
}) => {
  const sortExpressionHighlights = program.findEndowedNodesByType(
    "sort_expression_highlights"
  )?.[0];

  if (!sortExpressionHighlights) {
    throw new Error(
      "Filtering program action error: highlights sort does not exist"
    );
  }

  return program.updateNodeText(sortExpressionHighlights, "");
};

type FilterExpression =
  | {
      type: "dates";
      defaultDayFrom: string;
      defaultDayTo: string;
    }
  | { type: "relation"; defaultPredicate: string; defaultObject: string };

export const addRootLevelFilterExpression: FilterTreeAction<{
  expression: FilterExpression;
}> = ({ program, args }) => {
  const filterExpressionHighlights = program.findEndowedNodesByType(
    "filter_expression_highlights"
  )[0];

  const sortNode = program.findEndowedNodesByType(
    "sort_expression_highlights",
    filterExpressionHighlights
  )?.[0];

  let filterExpression = "";
  switch (args.expression.type) {
    case "dates":
      filterExpression = `from "${args.expression.defaultDayFrom}" to "${args.expression.defaultDayTo}"`;
      break;
    case "relation":
      filterExpression = `which ${args.expression.defaultPredicate} "${args.expression.defaultObject}"`;
      break;
  }

  if (sortNode) {
    return program.updateNodeText(
      filterExpressionHighlights,
      `highlights ${filterExpression} ${sortNode.rawNode.text}`
    );
  } else {
    return program.updateNodeText(
      filterExpressionHighlights,
      `highlights ${filterExpression}`
    );
  }
};

export const addFilterExpression: FilterTreeAction<{
  parentNode: EndowedNode;
  expression: FilterExpression;
  logicType: "and" | "or";
}> = ({ program, args }) => {
  const parentNode = args.parentNode;

  if (
    ![
      "highlights_criterion",
      "highlights_expression_conjunction",
      "highlights_expression_disjunction",
    ].includes(parentNode.type)
  ) {
    throw new Error(
      "Filtering program action error: incorrect node type for filter expression addition"
    );
  }

  let filterExpression = "";
  switch (args.expression.type) {
    case "dates":
      filterExpression = `from "${args.expression.defaultDayFrom}" to "${args.expression.defaultDayTo}"`;
      break;
    case "relation":
      filterExpression = `which ${args.expression.defaultPredicate} "${args.expression.defaultObject}"`;
      break;
  }

  const insertOutsideParens = () => {
    return program.updateNodeText(
      parentNode,
      `(${parentNode.rawNode.text} ${args.logicType} ${filterExpression})`
    );
  };

  const insertInsideParens = () => {
    const sansParens = parentNode.rawNode.text.slice(1, -1);

    return program.updateNodeText(
      parentNode,
      `(${sansParens} ${args.logicType} ${filterExpression})`
    );
  };

  switch (parentNode.type) {
    case "highlights_criterion": {
      return insertOutsideParens();
    }
    case "highlights_expression_conjunction": {
      if (args.logicType === "and") {
        return insertInsideParens();
      } else {
        return insertOutsideParens();
      }
    }
    case "highlights_expression_disjunction": {
      if (args.logicType === "or") {
        return insertInsideParens();
      } else {
        return insertOutsideParens();
      }
    }
  }
  return program;
};

export const removeFilterExpression: FilterTreeAction<{
  expression: EndowedNode;
}> = ({ program, args }) => {
  const expression = args.expression;

  const expressionParent = program.findParentOfNode(args.expression);

  if (expressionParent.type === "filter_expression_highlights") {
    return program.updateNodeText(expression, "");
  } else if (
    expressionParent.type === "highlights_expression_conjunction" ||
    expressionParent.type === "highlights_expression_disjunction"
  ) {
    const delimeter =
      expressionParent.type === "highlights_expression_conjunction"
        ? "and"
        : "or";

    const logicalExpression = expressionParent;
    const logicalExpressionSize = logicalExpression.children.filter(
      (child) => child.type === "highlights_expression"
    ).length;

    if (logicalExpressionSize === 1) {
      return program.updateNodeText(logicalExpression, "");
    } else if (logicalExpressionSize === 2) {
      // Remove the conjunction, replacing it with the remaining expression
      return program.updateNodeText(
        logicalExpression,
        logicalExpression.children.find(
          (child) =>
            child.type === "highlights_expression" &&
            child.coordinates !== expression.coordinates
        ).rawNode.text
      );
    } else {
      return program.updateNodeText(
        logicalExpression,
        `(${logicalExpression.children
          .filter(
            (child) =>
              child !== expression && child.type === "highlights_expression"
          )
          .map((child) => child.rawNode.text)
          .join(` ${delimeter} `)})`
      );
    }
  }

  return program;
};

export const changeSortType: FilterTreeAction<{
  sortTypeNode: EndowedNode;
  sortType: SortType;
}> = ({ program, args }) => {
  if (!args.sortTypeNode || args.sortTypeNode.type !== "highlights_sort_type") {
    throw new Error(
      "Filtering program action error: incorrect node type for sort type change"
    );
  }

  return program.updateNodeText(args.sortTypeNode, `${args.sortType}`);
};

export const changeFilterType: FilterTreeAction<{
  filterNode: EndowedNode;
  filterType: FilterType;
}> = ({ program, args }) => {
  if (!args.filterNode || args.filterNode.type !== "filter") {
    throw new Error(
      "Filtering program action error: incorrect node type for filter type change"
    );
  }

  return program.updateNodeText(args.filterNode, args.filterType);
};

export const changeDay: FilterTreeAction<{
  dayNode: EndowedNode;
  day: string;
}> = ({ program, args }) => {
  if (!args.dayNode || args.dayNode.type !== "day") {
    throw new Error(
      "Filtering program action error: incorrect node type for day change"
    );
  }

  return program.updateNodeText(args.dayNode, `"${args.day}"`);
};
