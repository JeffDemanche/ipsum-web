import { createTheme } from "@mui/material";
import { brown, amber, grey } from "@mui/material/colors";

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

const {
  palette: { augmentColor },
} = createTheme();

const createColor = (mainColor: string) =>
  augmentColor({ color: { main: mainColor } });

const baseTheme = createTheme({
  typography: {
    allVariants: {},
    h1: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "96px" },
    h2: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "60px" },
    h3: {
      fontFamily: "Inria Sans",
      fontWeight: "100",
      fontSize: "30px",
      color: `${grey[50]} !important`,
      backgroundColor: grey[900],
    },
    h4: {
      fontFamily: "Inria Sans",
      fontWeight: "100",
      fontSize: "24px",
      color: `${grey[50]} !important`,
      backgroundColor: grey[900],
    },
    h5: { fontFamily: "Inria Sans", fontWeight: "100", fontSizz: "20px" },
    h6: { fontFamily: "Inria Sans", fontWeight: "100", fontSize: "16px" },
    body1: {
      fontFamily: "Inria Sans",
      fontWeight: "regular",
      fontSize: "16px",
    },
    body2: {
      fontFamily: "Inria Sans",
      fontWeight: "regular",
      fontSize: "14px",
    },
    subtitle1: {
      fontFamily: "Inria Sans",
      fontWeight: "100",
      fontSize: "14px",
    },
    caption: {
      fontFamily: "Inria Sans",
      fontWeight: "regular",
      fontSize: "14px",
    },
  },
  palette: {
    primary: {
      main: grey[700],
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
});

export const theme = createTheme(
  {
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderRadius: "0px !important",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: { paper: { backgroundColor: brown[100] } },
      },
      MuiCard: {
        variants: [
          {
            props: { variant: "shadowed" },
            style: {
              backgroundColor: "rgba(255, 255, 255, .55)",
            },
          },
          {
            props: { variant: "translucent" },
            style: {
              backgroundColor: "white",
            },
          },
        ],
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "4px",
            height: "26px",
            fontFamily: baseTheme.typography.caption.fontFamily,
            fontSize: baseTheme.typography.caption.fontSize,
            fontWeight: baseTheme.typography.caption.fontWeight,
          },
        },
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
      MuiButtonBase: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
          },
        },
      },
      MuiButton: {
        variants: [],
        styleOverrides: {
          root: {
            borderRadius: "0px",
            textTransform: "none",
          },
        },
      },
      MuiPopover: {},
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: grey[700],
            fontSize: "15px",
            fontFamily: "Inria Sans",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            i: {
              color: grey[900],
            },
            color: grey[700],
            fontSize: "15px",
            fontFamily: "Inria Sans",
          },
        },
      },
    },
  },
  baseTheme
);
