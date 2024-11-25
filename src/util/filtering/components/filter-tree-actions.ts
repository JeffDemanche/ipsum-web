import { IpsumFilteringProgramV1 } from "../v1-filtering-program";

export type FilterTreeAction<T> = ({
  program,
  args,
}: {
  program: IpsumFilteringProgramV1;
  args: T;
}) => IpsumFilteringProgramV1;

export const addHighlightsSort: FilterTreeAction<{
  defaultSortType?:
    | "review status"
    | "importance"
    | "recent first"
    | "oldest first";
}> = ({ program, args }) => {
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
