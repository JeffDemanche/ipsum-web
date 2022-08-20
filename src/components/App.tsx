import React from "react";
import "normalize.css";
import "./App.less";
import { IpsumRouter } from "../views/IpsumRouter";
import { InMemoryStateProvider } from "state/in-memory/InMemoryStateProvider";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    allVariants: {},
  },
  palette: {
    primary: {
      main: "#aaa",
    },
  },
  components: {
    MuiPopper: {},
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
        },
      },
    },
  },
});

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <InMemoryStateProvider>
        <IpsumRouter />
      </InMemoryStateProvider>
    </ThemeProvider>
  );
};
