import { nextHue } from "util/colors";

describe("colors", () => {
  describe("nextHue", () => {
    it("generates 255 unique hues in a row", () => {
      let hue = 0;
      const set = new Set<number>();
      for (let i = 0; i < 255; i++) {
        hue = nextHue(hue);
        expect(set.has(hue)).toBeFalsy();
        set.add(hue);
      }
    });
  });
});
