import React from "react";
import "normalize.css";
import { IpsumRouter } from "../views/IpsumRouter";
import { ThemeProvider } from "@mui/material";
import { theme } from "styles/styles";
import "draft-js/dist/Draft.css";
import { InMemoryStateProvider } from "state/in-memory";
import { ApolloProvider } from "@apollo/client";
import { client, TestComponent } from "util/apollo";

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <TestComponent></TestComponent>
        <InMemoryStateProvider>
          <IpsumRouter />
        </InMemoryStateProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
};
