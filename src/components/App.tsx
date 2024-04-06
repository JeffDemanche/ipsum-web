import React from "react";
import "normalize.css";
import { IpsumRouter } from "../views/IpsumRouter";
import { ThemeProvider } from "@mui/material";
import { theme } from "components/styles";
import "simplebar-react/dist/simplebar.min.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "util/apollo";
import { ErrorBoundary } from "./ErrorBoundary";

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <IpsumRouter />
        </ApolloProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
