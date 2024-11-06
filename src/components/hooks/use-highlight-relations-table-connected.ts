import {
  apiDeleteRelationFromHighlightToArc,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";

import { RelationsTableConnectedProps } from "./use-arc-relations-table-connected";
import { useRelationChooserConnected } from "./use-relation-chooser-connected";

export const useHighlightRelationsTableConnected =
  (): RelationsTableConnectedProps => {
    const relationChooserProps = useRelationChooserConnected();

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
