import {
  apiDeleteRelationFromArcToArc,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";

import { useRelationChooserConnected } from "./use-relation-chooser-connected";

export const useArcRelationsTableConnected = () => {
  const relationChooserProps = useRelationChooserConnected();

  const [deleteRelationFromArcToArc] = useApiAction(
    apiDeleteRelationFromArcToArc
  );

  const insertLayer = useUrlAction(urlInsertLayer);

  const onArcClick = (arcId: string) => {
    insertLayer({ layer: { type: "arc_detail", arcId, expanded: "true" } });
  };

  return {
    ...relationChooserProps,
    onDeleteRelation: (id: string) => {
      deleteRelationFromArcToArc({ id });
    },
    onArcClick,
  };
};
