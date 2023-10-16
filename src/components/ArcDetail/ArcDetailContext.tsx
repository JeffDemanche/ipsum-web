import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";
import { ArcDetailContextValue } from "./types";

export const ArcDetailContext = React.createContext<ArcDetailContextValue>({
  arcId: undefined,
  arc: undefined,
});

const ArcDetailContextQuery = gql(`
  query ArcDetailContext($arcId: ID!) {
    arc(id: $arcId) {
      id
      name
      color
      arcEntry {
        entry {
          entryKey
        }
      }
    }
  }
`);

interface ArcDetailProviderProps {
  arcId: string;
  children: React.ReactNode;
}

export const ArcDetailProvider: React.FunctionComponent<
  ArcDetailProviderProps
> = ({ arcId, children }) => {
  const { data } = useQuery(ArcDetailContextQuery, { variables: { arcId } });

  return (
    <ArcDetailContext.Provider value={{ arcId, arc: data.arc }}>
      {children}
    </ArcDetailContext.Provider>
  );
};
