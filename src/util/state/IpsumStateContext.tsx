import { ApolloProvider } from "@apollo/client";
import React, { createContext, useEffect, useState } from "react";
import { client } from "util/apollo";
import { ProjectState } from "util/state";

interface IpsumStateContextType {
  setProjectState: (projectState: ProjectState) => void;
}

export const IpsumStateContext = createContext<
  IpsumStateContextType | undefined
>(undefined);

interface IpsumStateProviderProps {
  projectState?: ProjectState;
  children: React.ReactNode;
}

export let PROJECT_STATE: ProjectState;

export const dangerous_initializeProjectState = () => {
  PROJECT_STATE = new ProjectState();
};

export const IpsumStateProvider: React.FC<IpsumStateProviderProps> = ({
  projectState,
  children,
}) => {
  if (!PROJECT_STATE) {
    PROJECT_STATE = projectState ?? new ProjectState();
    // @ts-expect-error Expose global variable for testing
    global.PROJECT_STATE = PROJECT_STATE;
  }

  useEffect(() => {
    PROJECT_STATE = projectState ?? new ProjectState();
    // @ts-expect-error Expose global variable for testing
    global.PROJECT_STATE = PROJECT_STATE;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [, triggerRender] = useState(false);
  const setProjectState = (newProjectState: ProjectState) => {
    PROJECT_STATE = newProjectState;
    // @ts-expect-error Expose global variable for testing
    global.PROJECT_STATE = PROJECT_STATE;
    client.cache.reset();
    triggerRender((prev) => !prev);
  };

  return (
    <ApolloProvider client={client}>
      <IpsumStateContext.Provider value={{ setProjectState }}>
        {children}
      </IpsumStateContext.Provider>
    </ApolloProvider>
  );
};
