import { IpsumDateTime } from "util/dates";
import { APIContext } from "./use-api-action";

export const apiCreateOrUpdateEntry = (
  {
    entryKey,
    date,
    contentState,
  }: {
    entryKey: string;
    date: IpsumDateTime;
    contentState: string;
  },
  context: APIContext
) => {
  // TODO self-heal make sure ContentState -> correct arc assignments for this entry.
  // const updatedTextArcAssignmentIds = new IpsumEntityTransformer(
  //   parseContentState(contentState)
  // ).getAppliedTextArcAssignments();

  return [
    // (context: APIContext) => {
    //   updatedTextArcAssignmentIds.forEach((taa) => {
    //     // If a textArcAssignment in the content state doesn't exist in state, add
    //     // it.
    //     if (
    //       !Object.values(context.state.arcAssignments).find(
    //         (assgn) =>
    //           assgn.entryKey === entryKey &&
    //           assgn.id === taa.arcAssignmentId &&
    //           assgn.arcId === taa.arcId
    //       )
    //     ) {
    //       ///
    //     }
    //   });
    // },
    (context: APIContext, previousReturn: any) => {
      context.dispatch({
        type: "CREATE-OR-UPDATE-ENTRY",
        payload: {
          entryKey,
          date,
          contentState,
        },
      });
    },
  ];
};

export const apiDeleteEntry = (
  { entryKey }: { entryKey: string },
  context: APIContext
) => {
  return [
    (context: APIContext, previousReturn: any) => {
      context.dispatch({
        type: "DELETE-ENTRY",
        payload: {
          entryKey,
        },
      });
    },
  ];
};
