import { createTheme } from "@mui/material";
import { brown, amber, grey } from "@mui/material/colors";

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
    darkBackground: PaletteOptions["primary"];
    onSurfaceDisabled: string;
    onSurfaceHighEmphasis: string;
    onSurfaceMediumEmphasis: string;
    onPrimaryDisabled: string;
    onPrimaryHighEmphasis: string;
    onPrimaryMediumEmphasis: string;
  }
  interface PaletteOptions {
    darkBackground: PaletteOptions["primary"];
    onSurfaceDisabled: string;
    onSurfaceHighEmphasis: string;
    onSurfaceMediumEmphasis: string;
    onPrimaryDisabled: string;
    onPrimaryHighEmphasis: string;
    onPrimaryMediumEmphasis: string;
  }

  interface PaletteColor {
    darkBackground?: string;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    shadowed: true;
    translucent: true;
  }
}

declare module "@mui/material/Card" {
  interface CardPropsVariantOverrides {
    shadowed: true;
    translucent: true;
  }
}

export const theme = createTheme({
  typography: {
    allVariants: {},
    h1: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "96px" },
    h2: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "60px" },
    h3: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "30px" },
    h4: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "24px" },
    h5: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "20px" },
    h6: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "16px" },
    body1: { fontFamily: "Meiryo", fontWeight: "regular", fontSize: "16px" },
    body2: { fontFamily: "Meiryo", fontWeight: "regular", fontSize: "14px" },
    subtitle1: {
      fontFamily: "Inria Sans",
      fontWeight: "100",
      fontSize: "14px",
    },
  },
  palette: {
    primary: {
      main: brown[500],
      "700": brown[700],
    },
    secondary: {
      main: amber[500],
    },
    background: {
      default: brown[200],
    },
    darkBackground: {
      main: grey[900],
      contrastText: grey[50],
    },
    onSurfaceDisabled: "rgba(0, 0, 0, 0.38)",
    onSurfaceHighEmphasis: "rgba(0, 0, 0, 0.87)",
    onSurfaceMediumEmphasis: "rgba(0, 0, 0, 0.60)",
    onPrimaryDisabled: "rgba(255, 255, 255, 0.38)",
    onPrimaryHighEmphasis: "rgba(255, 255, 255, 0.87)",
    onPrimaryMediumEmphasis: "rgba(255, 255, 255, 0.60)",
  },
  components: {
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: brown[100] } },
    },
    MuiCard: {
      variants: [
        {
          props: { variant: "shadowed" },
          style: {
            borderRadius: "4px",
            backgroundColor: "rgba(210, 210, 210, .55)",
          },
        },
        {
          props: { variant: "translucent" },
          style: {
            borderRadius: "4px",
            backgroundColor: "rgba(210, 210, 210, .55)",
          },
        },
      ],
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: "shadowed" },
          style: {
            borderRadius: "0px",
            backgroundColor: "white",
          },
        },
        {
          props: { variant: "translucent" },
          style: {
            borderRadius: "0px",
            backgroundColor: "rgba(255, 255, 255, .55)",
            backdropFilter: "blur(5px)",
          },
        },
      ],
    },
    MuiOutlinedInput: {},
    MuiTextField: {},
    MuiDivider: {},
    MuiIconButton: {
      styleOverrides: {
        sizeSmall: {
          height: "24px",
          width: "24px",
        },
      },
    },
    MuiButton: {
      variants: [],
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiPopover: {},
    MuiToggleButton: {},
  },
});
