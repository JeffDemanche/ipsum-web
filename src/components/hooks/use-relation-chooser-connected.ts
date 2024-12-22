import { useQuery } from "@apollo/client";
import type { RelationChooser } from "components/molecules/RelationChooser";
import { useState } from "react";
import {
  apiCreateArc,
  apiCreateRelationFromArcToArc,
  apiCreateRelationFromHighlightToArc,
  useApiAction,
} from "util/api";
import type { RelationSubject } from "util/apollo";
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

interface UseRelationChooserConnectedProps {
  subjectType: RelationSubject["__typename"] | "None";
  subjectId?: string;
  onCloseAction?: () => void;
}

export const useRelationChooserConnected = ({
  subjectType,
  subjectId,
  onCloseAction,
}: UseRelationChooserConnectedProps): RelationChooserConnectedProps => {
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
  const [createRelationFromArcToArc] = useApiAction(
    apiCreateRelationFromArcToArc
  );

  const onArcCreate = (name: string): string => {
    return createArc({ name }).id;
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
      if (subjectType === "Highlight") {
        createRelationFromHighlightToArc({
          highlightId: subjectId,
          arcId: relation.objectId,
          predicate: relation.predicate,
        });
      } else if (subjectType === "Arc") {
        createRelationFromArcToArc({
          subjectArcId: subjectId,
          objectArcId: relation.objectId,
          predicate: relation.predicate,
        });
      }

      onCloseAction?.();
    },
  };
};
