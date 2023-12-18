import React from "react";
import "normalize.css";
import { IpsumRouter } from "../views/IpsumRouter";
import { ThemeProvider } from "@mui/material";
import { theme } from "styles/styles";
import "simplebar-react/dist/simplebar.min.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "util/apollo";

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <IpsumRouter />
      </ApolloProvider>
    </ThemeProvider>
  );
};
