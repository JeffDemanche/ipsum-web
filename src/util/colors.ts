export const randomHue = () => Math.floor(Math.random() * 360);

export class IpsumArcColor {
  private _hue: number;

  constructor(hue: number) {
    this._hue = hue;
  }

  toHsla(saturation: number, lightness: number, alpha: number) {
    return `hsla(${this._hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }
}
