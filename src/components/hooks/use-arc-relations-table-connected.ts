import { useQuery } from "@apollo/client";
import {
  RelationChooser,
  RelationChooserRelation,
} from "components/molecules/RelationChooser";
import { useState } from "react";
import {
  apiCreateRelationFromArcToArc,
  apiDeleteRelationFromArcToArc,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";

const UseArcRelationsTableConnectedQuery = gql(`
  query UseArcRelationsTableConnected($search: String!) {
    searchArcsByName(search: $search) {
      id
      name
      color
    }
  }
`);

export const useArcRelationsTableConnected = () => {
  const [arcSearch, setArcSearch] = useState<string | undefined>(undefined);
  const { data: arcSearchData } = useQuery(UseArcRelationsTableConnectedQuery, {
    variables: {
      search: arcSearch,
    },
    skip: !arcSearch,
  });

  const arcSearchResults: React.ComponentProps<
    typeof RelationChooser
  >["arcResults"] = arcSearchData?.searchArcsByName.map((arc) => ({
    id: arc.id,
    hue: arc.color,
    name: arc.name,
  }));

  const [createRelationFromArcToArc] = useApiAction(
    apiCreateRelationFromArcToArc
  );

  const [deleteRelationFromArcToArc] = useApiAction(
    apiDeleteRelationFromArcToArc
  );

  const insertLayer = useUrlAction(urlInsertLayer);

  const onArcClick = (arcId: string) => {
    insertLayer({ layer: { type: "arc_detail", arcId, expanded: "true" } });
  };

  return {
    onCreateRelation: (relation: RelationChooserRelation) => {
      createRelationFromArcToArc({
        subjectArcId: relation.subjectId,
        objectArcId: relation.objectId,
        predicate: relation.predicate,
      });
    },
    onDeleteRelation: (id: string) => {
      deleteRelationFromArcToArc({ id });
    },
    arcResults: arcSearchResults,
    onArcSearch: setArcSearch,
    onArcClick,
  };
};
