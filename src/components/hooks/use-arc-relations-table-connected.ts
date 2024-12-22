import type { RelationsTable } from "components/molecules/RelationsTable";
import {
  apiDeleteRelationFromArcToArc,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";

import type {
  RelationChooserConnectedProps} from "./use-relation-chooser-connected";
import {
  useRelationChooserConnected,
} from "./use-relation-chooser-connected";

export type RelationsTableConnectedProps = Pick<
  React.ComponentProps<typeof RelationsTable>,
  "onDeleteRelation" | "onArcClick"
> & { relationChooserProps: RelationChooserConnectedProps };

interface UseArcRelationsTableConnectedProps {
  arcId: string;
}

export const useArcRelationsTableConnected = ({
  arcId,
}: UseArcRelationsTableConnectedProps): RelationsTableConnectedProps => {
  const relationChooserProps = useRelationChooserConnected({
    subjectType: "Arc",
    subjectId: arcId,
  });

  const [deleteRelationFromArcToArc] = useApiAction(
    apiDeleteRelationFromArcToArc
  );

  const insertLayer = useUrlAction(urlInsertLayer);

  const onArcClick = (arcId: string) => {
    insertLayer({ layer: { type: "arc_detail", arcId, expanded: "true" } });
  };

  return {
    relationChooserProps,
    onDeleteRelation: (id: string) => {
      deleteRelationFromArcToArc({ id });
    },
    onArcClick,
  };
};
