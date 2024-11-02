import { useQuery } from "@apollo/client";
import { RelationChooser } from "components/molecules/RelationChooser";
import { useState } from "react";
import {
  apiCreateArc,
  apiCreateRelationFromHighlightToArc,
  useApiAction,
} from "util/api";
import { gql } from "util/apollo";

export type RelationChooserConnectedProps = Pick<
  React.ComponentProps<typeof RelationChooser>,
  "arcResults" | "onArcCreate" | "onArcSearch" | "onRelationChoose"
>;

const UseRelationChooserConnectedQuery = gql(`
  query UseRelationChooserConnected($search: String!) {
    searchArcsByName(search: $search) {
      id
      name
      color
    }
  }
`);

export const useRelationChooserConnected =
  (): RelationChooserConnectedProps => {
    const [arcSearch, setArcSearch] = useState<string | undefined>(undefined);
    const { data: arcSearchData } = useQuery(UseRelationChooserConnectedQuery, {
      variables: {
        search: arcSearch,
      },
      skip: !arcSearch,
    });

    const [createArc] = useApiAction(apiCreateArc);

    const [createRelationFromHighlightToArc] = useApiAction(
      apiCreateRelationFromHighlightToArc
    );

    const onArcCreate = (name: string) => {
      createArc({ name });
    };

    const arcSearchResults: React.ComponentProps<
      typeof RelationChooser
    >["arcResults"] = arcSearchData?.searchArcsByName.map((arc) => ({
      id: arc.id,
      hue: arc.color,
      name: arc.name,
    }));

    return {
      arcResults: arcSearchResults,
      onArcCreate,
      onArcSearch: setArcSearch,
      onRelationChoose: (relation) => {
        createRelationFromHighlightToArc({
          highlightId: relation.subjectId,
          arcId: relation.objectId,
          predicate: relation.predicate,
        });
      },
    };
  };
