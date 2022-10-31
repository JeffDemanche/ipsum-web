import React from "react";
import "normalize.css";
import "./App.less";
import { IpsumRouter } from "../views/IpsumRouter";
import { InMemoryStateProvider } from "state/in-memory/InMemoryStateProvider";
import { ThemeProvider } from "@mui/material";
import { theme } from "styles/styles";
import "draft-js/dist/Draft.css";

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <InMemoryStateProvider>
        <IpsumRouter />
      </InMemoryStateProvider>
    </ThemeProvider>
  );
};
