import { RelationsTable } from "components/molecules/RelationsTable";
import {
  apiDeleteRelationFromArcToArc,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";

import {
  RelationChooserConnectedProps,
  useRelationChooserConnected,
} from "./use-relation-chooser-connected";

export type RelationsTableConnectedProps = Pick<
  React.ComponentProps<typeof RelationsTable>,
  "onDeleteRelation" | "onArcClick"
> & { relationChooserProps: RelationChooserConnectedProps };

export const useArcRelationsTableConnected =
  (): RelationsTableConnectedProps => {
    const relationChooserProps = useRelationChooserConnected();

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
