import { createTheme } from "@mui/material";
import { amber, brown, grey } from "@mui/material/colors";

import {
  border_radius_inputs,
  border_radius_popover,
  box_shadow_primary,
  font_family_sans,
  font_size_small,
  font_weight_light,
  grey100,
  grey500,
  grey700,
  grid_x_1,
  grid_x_5,
} from "./constants";

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

const baseTheme = createTheme({
  typography: {
    allVariants: {},
    h1: { fontFamily: "Amstelvar", fontWeight: "100", fontSize: "96px" },
    h2: { fontFamily: "Amstelvar", fontWeight: "100", fontSize: "60px" },
    h3: {
      fontFamily: "Amstelvar",
      fontWeight: "100",
      fontSize: "30px",
      color: `${grey[50]} !important`,
      backgroundColor: grey[900],
    },
    h4: {
      fontFamily: "Amstelvar",
      fontWeight: "100",
      fontSize: "24px",
      color: `${grey[50]} !important`,
      backgroundColor: grey[900],
    },
    h5: { fontFamily: "Amstelvar", fontWeight: "100", fontSizz: "20px" },
    h6: { fontFamily: "Amstelvar", fontWeight: "100", fontSize: "16px" },
    body1: {
      fontFamily: "Roboto",
      fontWeight: "light",
      fontSize: "16px",
    },
    body2: {
      fontFamily: "Roboto",
      fontWeight: "light",
      fontSize: "14px",
    },
    subtitle1: {
      fontFamily: "Amstelvar",
      fontWeight: "100",
      fontSize: "14px",
    },
    caption: {
      fontFamily: "Roboto",
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
        styleOverrides: {
          paper: {
            borderColor: grey500,
          },
        },
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
              borderRadius: border_radius_inputs,
              backgroundColor: "white",
            },
          },
          {
            props: { variant: "translucent" },
            style: {
              borderRadius: border_radius_inputs,
              backgroundColor: "rgba(255, 255, 255, .55)",
              backdropFilter: "blur(5px)",
            },
          },
        ],
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
          },
          input: {
            border: "none",
          },
        },
      },
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
            color: grey700,
            borderColor: grey700,
            minWidth: grid_x_1,
            height: grid_x_5,
            paddingRight: grid_x_1,
            paddingLeft: grid_x_1,
            borderRadius: border_radius_inputs,
            textTransform: "none",
          },
          outlined: {
            boxShadow: box_shadow_primary,
          },
          contained: {
            backgroundColor: grey700,
            color: grey100,
            boxShadow: box_shadow_primary,
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: border_radius_popover,
            boxShadow: box_shadow_primary,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            height: grid_x_5,
            paddingRight: grid_x_1,
            paddingLeft: grid_x_1,
            borderRadius: border_radius_inputs,
            textTransform: "none",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          nativeInput: {
            color: grey700,
            borderColor: grey700,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: grey700,
            borderColor: grey700,
            fontSize: font_size_small,
            fontFamily: font_family_sans,
            fontWeight: font_weight_light,
            borderRadius: border_radius_inputs,
            height: grid_x_5,
            padding: "0",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: font_size_small,
            fontFamily: font_family_sans,
            fontWeight: font_weight_light,
          },
        },
      },
    },
  },
  baseTheme
);
