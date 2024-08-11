import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";

import { ArcPage } from "./ArcPage";

interface ArcPageConnectedProps {
  arcId: string;
}

const ArcPageQuery = gql(`
  query ArcPage($arcId: ID!) {
    arc(id: $arcId) {
      id
      name
      color
    }
  }
`);

export const ArcPageConnected: React.FunctionComponent<
  ArcPageConnectedProps
> = ({ arcId }) => {
  const { data } = useQuery(ArcPageQuery, {
    variables: {
      arcId,
    },
  });

  const arc = data.arc;

  return (
    <ArcPage
      arc={{ hue: arc.color, name: arc.name }}
      expanded
      onExpand={() => {}}
      onCollapse={() => {}}
    />
  );
};
