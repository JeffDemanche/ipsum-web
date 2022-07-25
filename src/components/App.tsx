import React from "react";
import "normalize.css";
import "./App.less";
import { IpsumRouter } from "../views/IpsumRouter";
import { InMemoryStateProvider } from "state/in-memory/InMemoryStateProvider";

export const App: React.FC = () => {
  return (
    <InMemoryStateProvider>
      <IpsumRouter />
    </InMemoryStateProvider>
  );
};
