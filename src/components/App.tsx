import React from "react";
import "normalize.css";
import "./App.less";
import { IpsumRouter } from "../views/IpsumRouter";
import { InMemoryStateProvider } from "state/in-memory/InMemoryStateProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { stylesheet } from "styles/styles";

export const theme = createTheme({
  typography: {
    allVariants: {},
  },
  palette: {
    primary: {
      main: stylesheet.colors.paper_3,
      light: stylesheet.colors.paper_1,
      dark: stylesheet.colors.paper_9,
      contrastText: "white",
    },
    secondary: {
      main: "#345",
      light: "#345",
      dark: "#345",
      contrastText: "white",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          color: stylesheet.colors.paper_9,
          backgroundColor: stylesheet.colors.paper_1_90,
          borderBottom: `1px solid ${stylesheet.colors.paper_9}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: stylesheet.colors.paper_9,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: stylesheet.colors.paper_3,
          border: `1px solid ${stylesheet.colors.paper_3}`,
          boxShadow: "1px 1px 0px rgba(0, 0, 0, 0.5)",
          fontFamily: stylesheet.fonts.controls_2,
          padding: "2px 6px 2px 6px",
          borderRadius: "0px",
          minWidth: "25px",
        },
        textPrimary: {
          color: stylesheet.colors.paper_3,
          border: `1px solid ${stylesheet.colors.paper_3}`,
        },
        textSecondary: {
          color: stylesheet.colors.paper_9,
          border: `1px solid ${stylesheet.colors.paper_9}`,
          boxShadow: "1px 1px 0px rgba(255, 255, 255, 0.5)",
          ":hover": {
            color: stylesheet.colors.paper_7,
            border: `1px solid ${stylesheet.colors.paper_7}`,
          },
        },
      },
    },
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
