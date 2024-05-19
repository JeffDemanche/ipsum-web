import type { Preview } from "@storybook/react";
import { ThemeProvider } from "@mui/material";
import React from "react";
import { theme } from "../src/components/styles";

// Global highlight styles, doesn't use Less-loader.
import "../src/components/styles/static-highlight.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];

export default preview;
