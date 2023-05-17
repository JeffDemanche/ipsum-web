import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";
import { ArcDetailContextValue } from "./types";

export const ArcDetailContext = React.createContext<ArcDetailContextValue>({
  arcId: undefined,
  arc: undefined,
  incomingHighlightId: undefined,
});

const ArcDetailContextQuery = gql(`
  query ArcDetailContext($arcId: ID!) {
    arc(id: $arcId) {
      id
      name
      color
    }
  }
`);

interface ArcDetailProviderProps {
  arcId: string;
  incomingHighlightId?: string;
  children: React.ReactNode;
}

export const ArcDetailProvider: React.FunctionComponent<
  ArcDetailProviderProps
> = ({ arcId, incomingHighlightId, children }) => {
  const { data } = useQuery(ArcDetailContextQuery, { variables: { arcId } });

  return (
    <ArcDetailContext.Provider
      value={{ arcId, arc: data.arc, incomingHighlightId }}
    >
      {children}
    </ArcDetailContext.Provider>
  );
};
