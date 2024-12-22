import {
  apiDeleteRelationFromHighlightToArc,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";

import type { RelationsTableConnectedProps } from "./use-arc-relations-table-connected";
import { useRelationChooserConnected } from "./use-relation-chooser-connected";

interface UseHighlightRelationsTableConnectedProps {
  highlightId: string;
}

export const useHighlightRelationsTableConnected = ({
  highlightId,
}: UseHighlightRelationsTableConnectedProps): RelationsTableConnectedProps => {
  const relationChooserProps = useRelationChooserConnected({
    subjectType: "Highlight",
    subjectId: highlightId,
  });

  const [deleteRelationFromHighlightToArc] = useApiAction(
    apiDeleteRelationFromHighlightToArc
  );

  const insertLayer = useUrlAction(urlInsertLayer);

  const onArcClick = (arcId: string) => {
    insertLayer({ layer: { type: "arc_detail", arcId, expanded: "true" } });
  };

  return {
    relationChooserProps,
    onDeleteRelation: (id: string) => {
      deleteRelationFromHighlightToArc({ id });
    },
    onArcClick,
  };
};
