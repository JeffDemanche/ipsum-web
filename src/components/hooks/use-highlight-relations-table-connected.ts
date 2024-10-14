import { useQuery } from "@apollo/client";
import {
  RelationChooser,
  RelationChooserRelation,
} from "components/molecules/RelationChooser";
import { useState } from "react";
import {
  apiCreateRelationFromHighlightToArc,
  apiDeleteRelationFromHighlightToArc,
  useApiAction,
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

  const [createRelationFromHighlightToArc] = useApiAction(
    apiCreateRelationFromHighlightToArc
  );

  const [deleteRelationFromHighlightToArc] = useApiAction(
    apiDeleteRelationFromHighlightToArc
  );

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
  };
};
