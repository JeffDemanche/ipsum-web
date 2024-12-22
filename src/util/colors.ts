import convert from "color-convert";
import type { HSL, RGB } from "color-convert/conversions";

/**
 * Generates a new hue given the last hue created. The new hue will have be 2/11
 * of the way around the color wheel from the old hue, which also gives this
 * function the property that continuing to generate new hues will traverse all
 * 255 possible hue values before a duplicate is generated.
 */
export const nextHue = (prevHue: number | undefined): number => {
  if (prevHue === undefined) return 0;

  const step = 2 / 11;

  return Math.round(prevHue + step * 255) % 255;
};

export const rgbToHsl = (rgb: number[]): HSL => convert.rgb.hsl(rgb as RGB);

export const hslToRgb = (hsl: number[]): RGB => convert.hsl.rgb(hsl as HSL);

export const multiply = (rgb1: number[], rgb2: number[]): number[] =>
  rgb1.map((c, i) => Math.floor((c * rgb2[i]) / 255));

interface SaturationLightness {
  saturation: number;
  lightness: number;
}

export const multiplyHues = (
  hues: number[],
  { saturation, lightness }: SaturationLightness,
  alpha?: number
): IpsumColor => {
  const ipsumArcColors = hues.map((arcColor) => new IpsumArcColor(arcColor));
  const rgbColors = ipsumArcColors.map((c) =>
    c.toRgb({ saturation, lightness })
  );
  const arcsMultiplied = rgbColors.reduce(
    (acc, cur) => multiply(acc, cur),
    [255, 255, 255]
  );
  return new IpsumColor("rgb", arcsMultiplied, alpha);
};

type IpsumColorMode = "hsl" | "rgb";

export class IpsumColor {
  private _rgb: [r: number, g: number, b: number];
  private _alpha: number;

  /**
   * @param mode Color mode to construct from.
   * @param value Triple, values depend on mode.
   * @param alpha Should be decimal between 0 and 1.
   */
  constructor(mode: IpsumColorMode, value: number[], alpha?: number) {
    if (value.length !== 3)
      throw new Error("IpsumColor value must be tuple with 3 values");

    if (mode === "hsl") {
      this._rgb = hslToRgb(value);
    } else {
      this._rgb = value as RGB;
    }
    this._alpha = alpha ?? 1;
  }

  get rgb(): RGB {
    return this._rgb;
  }

  get hsl(): HSL {
    return rgbToHsl(this._rgb);
  }

  setAlpha(alpha: number): IpsumColor {
    return new IpsumColor("rgb", this._rgb, alpha);
  }

  toRgbaCSS(): string {
    return `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, ${this._alpha})`;
  }
}

export class IpsumArcColor {
  private _hue: number | undefined;

  constructor(hue: number | undefined) {
    this._hue = hue;
  }

  toIpsumColor({ saturation, lightness }: SaturationLightness): IpsumColor {
    return new IpsumColor("hsl", [
      this._hue ?? 0,
      this._hue ? saturation : 0,
      lightness,
    ]);
  }

  toRgb({ saturation, lightness }: SaturationLightness) {
    return hslToRgb([this._hue ?? 0, this._hue ? saturation : 0, lightness]);
  }

  toHsl({ saturation, lightness }: SaturationLightness) {
    return [this._hue ?? 0, this._hue ? saturation : 0, lightness];
  }
}
