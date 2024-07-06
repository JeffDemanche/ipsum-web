import { ApolloProvider } from "@apollo/client";
import React, { createContext, useEffect } from "react";
import { client } from "util/apollo";
import { ProjectState } from "util/state/project/project-state";

interface IpsumStateContextType {
  projectState: ProjectState;
}

export const IpsumStateContext = createContext<
  IpsumStateContextType | undefined
>(undefined);

interface IpsumStateProviderProps {
  projectState?: ProjectState;
  children: React.ReactNode;
}

export let PROJECT_STATE: ProjectState;

export const IpsumStateProvider: React.FC<IpsumStateProviderProps> = ({
  projectState,
  children,
}) => {
  if (!PROJECT_STATE) {
    PROJECT_STATE = projectState ?? new ProjectState();
  }

  useEffect(() => {
    PROJECT_STATE = projectState ?? new ProjectState();
  }, [projectState]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
