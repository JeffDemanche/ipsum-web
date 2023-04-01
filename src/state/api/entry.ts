import { ContentState } from "draft-js";
import { parseContentState, stringifyContentState } from "util/content-state";
import { IpsumDateTime, stringifyIpsumDateTime } from "util/dates";
import { IpsumEntityTransformer } from "util/entities";
import { APIContext, APIReturn } from "./use-api-action";
import { Document } from "../in-memory/in-memory-schema";

export const apiCreateOrUpdateEntry = (
  {
    entryKey,
    date,
    contentState,
  }: {
    entryKey: string;
    date: IpsumDateTime;
    contentState: ContentState;
  },
  context: APIContext
): APIReturn => {
  const create = !context.state.entry[entryKey];

  if (create)
    context = context.optimisticStateDispatch(context.state, {
      type: "CREATE_DOCUMENT",
      payload: {
        type: "entry",
        document: {
          entryKey,
          date: stringifyIpsumDateTime(date),
          contentState: stringifyContentState(contentState),
        },
      },
    });
  else {
    const oldTextArcAssignmentIds = new IpsumEntityTransformer(
      parseContentState(context.state.entry[entryKey].contentState)
    )
      .getAppliedTextArcAssignments()
      .map((a) => a.arcAssignmentId);
    const newTextArcAssignments = new IpsumEntityTransformer(
      contentState
    ).getAppliedTextArcAssignments();

    const newTextArcAssignmentIds = newTextArcAssignments.map(
      (a) => a.arcAssignmentId
    );

    const addedAssignments: Partial<Document<"highlight">>[] =
      newTextArcAssignments
        .filter(
          (newAssignment) =>
            !oldTextArcAssignmentIds.includes(newAssignment.arcAssignmentId)
        )
        .map((a) => ({ id: a.arcAssignmentId, arcId: a.arcId, entryKey }));
    const removedAssignments = oldTextArcAssignmentIds.filter(
      (oldAssignment) => !newTextArcAssignmentIds.includes(oldAssignment)
    );

    addedAssignments.forEach((assignment) => {
      context = context.optimisticStateDispatch(context.state, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "highlight",
          document: assignment,
        },
      });
    });
    context = context.optimisticStateDispatch(context.state, {
      type: "REMOVE_DOCUMENTS",
      payload: {
        type: "highlight",
        keys: removedAssignments,
      },
    });
    context = context.optimisticStateDispatch(context.state, {
      type: "UPDATE_DOCUMENT",
      payload: {
        type: "entry",
        key: entryKey,
        update: {
          date: stringifyIpsumDateTime(date),
          contentState: stringifyContentState(contentState),
        },
      },
    });
  }
  return { state: context.state };
};

export const apiDeleteEntry = (
  { entryKey }: { entryKey: string },
  context: APIContext
): APIReturn => {
  context = context.optimisticStateDispatch(context.state, {
    type: "REMOVE_DOCUMENT",
    payload: {
      type: "entry",
      key: entryKey,
    },
  });
  const arcAssignmentsForEntry =
    context.state.__indices.highlight["entryKey"][entryKey];
  context = context.optimisticStateDispatch(context.state, {
    type: "REMOVE_DOCUMENTS",
    payload: {
      type: "highlight",
      keys: arcAssignmentsForEntry,
    },
  });

  return { state: context.state };
};
