import React, { createContext, useState } from "react";

import { ProjectState } from "./project-state";

interface ProjectStateContextType {
  state: ProjectState;
}

export const ProjectStateContext = createContext<
  ProjectStateContextType | undefined
>(undefined);

export const ProjectStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ProjectStateContextType>({
    state: new ProjectState(),
  });

  return (
    <ProjectStateContext.Provider value={state}>
      {children}
    </ProjectStateContext.Provider>
  );
};
