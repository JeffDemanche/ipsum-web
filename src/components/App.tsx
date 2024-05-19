import "normalize.css";
import "simplebar-react/dist/simplebar.min.css";
// Highlight styles are lifted globally so the classname is a constant.
import "./styles/static-highlight.css";

import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@mui/material";
import { theme } from "components/styles";
import React from "react";
import { client } from "util/apollo";
import { IpsumRouter } from "views/IpsumRouter";

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
