import { IpsumURL } from "../urls";

describe("IpsumURL", () => {
  describe("base url", () => {
    it("gets empty path view", () => {
      const url = new IpsumURL(new URL("http://www.ipsumdomain.com/"));
      expect(url.getView()).toEqual("");
    });

    it("gets journal path view", () => {
      const url = new IpsumURL(new URL("http://www.ipsumdomain.com/journal"));
      expect(url.getView()).toEqual("journal");
    });

    it("gets a subview with slash", () => {
      const url = new IpsumURL(
        new URL("http://www.ipsumdomain.com/journal/subview")
      );
      expect(url.getView()).toEqual("journal/subview");
    });

    it("gets view data into qs object format", () => {
      const url = new IpsumURL(
        new URL("http://www.ipsumdomain.com/journal/subview?foo[bar]=baz")
      );
      expect(url.getViewData()).toEqual({ foo: { bar: "baz" } });
    });
  });
});
