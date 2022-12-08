import React from "react";
import "normalize.css";
import { IpsumRouter } from "../views/IpsumRouter";
import { InMemoryStateProvider } from "components/InMemoryStateContext/InMemoryStateContext";
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
