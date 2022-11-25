import { createTheme } from "@mui/material";

export const stylesheet = {
  colors: {
    paper_1: "rgb(44, 36, 25)",
    paper_1_90: "rgba(44, 36, 25, 0.9)",
    paper_3: "rgb(105, 79, 41)",
    paper_5: "rgb(131, 112, 87)",
    paper_7: "rgb(166, 144, 115)",
    paper_9: "rgb(237, 222, 201)",
    background: "rgb(245, 237, 224)",
    foreground: "rgb(255, 250, 243)",
  },
  fonts: {
    headers: '"Libre Baskerville", serif',
    controls_2: '"Inria Sans", sans-serif',
    entry_1: '"Shippori Mincho", serif',
  },
};

declare module "@mui/material/styles" {
  interface Palette {
    onSurfaceDisabled: string;
    onSurfaceHighEmphasis: string;
    onSurfaceMediumEmphasis: string;
  }
  interface PaletteOptions {
    onSurfaceDisabled: string;
    onSurfaceHighEmphasis: string;
    onSurfaceMediumEmphasis: string;
  }
}

export const theme = createTheme({
  typography: {
    allVariants: {},
  },
  palette: {
    background: {
      default: "#EBEBEB",
    },
    onSurfaceDisabled: "rgba(0, 0, 0, 0.38)",
    onSurfaceHighEmphasis: "rgba(0, 0, 0, 0.60)",
    onSurfaceMediumEmphasis: "rgba(0, 0, 0, 0.87)",
  },
  components: {
    MuiLink: {
      // styleOverrides: {
      //   root: {
      //     fontFamily: stylesheet.fonts.controls_2,
      //     cursor: "pointer",
      //     color: stylesheet.colors.paper_9,
      //     textDecorationColor: stylesheet.colors.paper_9,
      //     ":hover": {
      //       color: stylesheet.colors.paper_7,
      //       textDecorationColor: stylesheet.colors.paper_7,
      //     },
      //   },
      // },
    },
    MuiOutlinedInput: {
      // styleOverrides: {
      //   root: {
      //     color: stylesheet.colors.paper_9,
      //     height: "100%",
      //     borderRadius: "0px",
      //   },
      // },
    },
    MuiTextField: {
      // styleOverrides: {
      //   root: {
      //     color: stylesheet.colors.paper_9,
      //     padding: "0px",
      //     backgroundColor: stylesheet.colors.paper_1_90,
      //     borderBottom: `1px solid ${stylesheet.colors.paper_9}`,
      //   },
      // },
    },
    MuiDivider: {
      // styleOverrides: {
      //   root: {
      //     backgroundColor: stylesheet.colors.paper_9,
      //   },
      // },
    },
    MuiButton: {
      // styleOverrides: {
      //   root: {
      //     color: stylesheet.colors.paper_3,
      //     fontFamily: stylesheet.fonts.controls_2,
      //     padding: "2px 6px 2px 6px",
      //     borderRadius: "2px",
      //     minWidth: "25px",
      //   },
      //   textPrimary: {
      //     ":hover": {
      //       border: "none",
      //     },
      //   },
      //   outlinedPrimary: {
      //     color: stylesheet.colors.paper_3,
      //     border: `1px solid ${stylesheet.colors.paper_3}`,
      //     boxShadow: "1px 1px 0px rgba(0, 0, 0, 0.5)",
      //   },
      //   outlinedSecondary: {
      //     color: stylesheet.colors.paper_9,
      //     border: `1px solid ${stylesheet.colors.paper_9}`,
      //     boxShadow: "1px 1px 0px rgba(255, 255, 255, 0.5)",
      //     ":hover": {
      //       color: stylesheet.colors.paper_7,
      //       border: `1px solid ${stylesheet.colors.paper_7}`,
      //     },
      //   },
      // },
    },
    MuiPopover: {
      // styleOverrides: {
      //   paper: {
      //     boxShadow: "none",
      //   },
      // },
    },
    MuiToggleButton: {
      // styleOverrides: {
      //   root: {
      //     backgroundColor: stylesheet.colors.foreground,
      //     borderRadius: "0px",
      //     ":hover": {
      //       backgroundColor: stylesheet.colors.foreground,
      //     },
      //     "&.Mui-selected": {
      //       backgroundColor: stylesheet.colors.foreground,
      //       ":hover": {
      //         backgroundColor: stylesheet.colors.foreground,
      //       },
      //     },
      //   },
      // },
    },
  },
});
