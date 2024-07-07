import { CSSProperties } from "react";

type HueStyle =
  | "dark_background"
  | "light_background"
  | "on_dark_background"
  | "on_light_background"
  | "on_light_background_subtle";

export const hueSwatch = (
  hue: number,
  style: HueStyle
): CSSProperties["color"] => {
  switch (style) {
    case "dark_background":
      return `hsl(${hue}, 20%, 40%)`;
    case "light_background":
      return `hsl(${hue}, 80%, 95%)`;
    case "on_dark_background":
      return `hsl(${hue}, 40%, 95%)`;
    case "on_light_background":
      return `hsl(${hue}, 20%, 40%)`;
    case "on_light_background_subtle":
      return `hsl(${hue}, 20%, 60%)`;
  }
};
