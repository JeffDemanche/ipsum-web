import { useQuery } from "@apollo/client";
import {
  RelationChooser,
  RelationChooserRelation,
} from "components/molecules/RelationChooser";
import { useState } from "react";
import {
  apiCreateArc,
  apiCreateRelationFromHighlightToArc,
  apiDeleteRelationFromHighlightToArc,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";

const UseHighlightRelationsTableConnectedQuery = gql(`
  query UseHighlightRelationsTableConnected($search: String!) {
    searchArcsByName(search: $search) {
      id
      name
      color
    }
  }
`);

export const useHighlightRelationsTableConnected = () => {
  const [arcSearch, setArcSearch] = useState<string | undefined>(undefined);
  const { data: arcSearchData } = useQuery(
    UseHighlightRelationsTableConnectedQuery,
    {
      variables: {
        search: arcSearch,
      },
      skip: !arcSearch,
    }
  );

  const arcSearchResults: React.ComponentProps<
    typeof RelationChooser
  >["arcResults"] = arcSearchData?.searchArcsByName.map((arc) => ({
    id: arc.id,
    hue: arc.color,
    name: arc.name,
  }));

  const [createArc] = useApiAction(apiCreateArc);

  const [createRelationFromHighlightToArc] = useApiAction(
    apiCreateRelationFromHighlightToArc
  );

  const [deleteRelationFromHighlightToArc] = useApiAction(
    apiDeleteRelationFromHighlightToArc
  );

  const insertLayer = useUrlAction(urlInsertLayer);

  const onArcCreate = (name: string) => {
    createArc({ name });
  };

  const onArcClick = (arcId: string) => {
    insertLayer({ layer: { type: "arc_detail", arcId, expanded: "true" } });
  };

  return {
    onCreateRelation: (relation: RelationChooserRelation) => {
      createRelationFromHighlightToArc({
        highlightId: relation.subjectId,
        arcId: relation.objectId,
        predicate: relation.predicate,
      });
    },
    onDeleteRelation: (id: string) => {
      deleteRelationFromHighlightToArc({ id });
    },
    arcResults: arcSearchResults,
    onArcSearch: setArcSearch,
    onArcCreate,
    onArcClick,
  };
};
