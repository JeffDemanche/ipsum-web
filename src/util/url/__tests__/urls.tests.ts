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
  });

  describe("journal view url", () => {
    it("gets layers from url with 0 layers", () => {
      const url = new IpsumURL(
        new URL("http://www.ipsumdomain.com/journal")
      ).getJournalUrl();
      expect(url.getLayers()).toEqual([]);
    });

    it("gets layers from url with 2 layers", () => {
      const url = new IpsumURL(
        new URL(
          "http://www.ipsumdomain.com/journal?l1=arc_detail,12341234,abcdabcd&l2=arc_detail,56785678,efghefgh"
        )
      ).getJournalUrl();
      expect(url.getLayers()).toEqual([
        { type: "arc_detail", objectId: "12341234", connectionId: "abcdabcd" },
        { type: "arc_detail", objectId: "56785678", connectionId: "efghefgh" },
      ]);
    });

    it("adds layer if no existing layers", () => {
      const url = new IpsumURL(new URL("http://www.ipsumdomain.com/journal"))
        .getJournalUrl()
        .addLayer({
          type: "arc_detail",
          objectId: "56785678",
          connectionId: "efghefgh",
        });
      expect(url.getLayers()).toEqual([
        { type: "arc_detail", objectId: "56785678", connectionId: "efghefgh" },
      ]);
    });

    it("adds layer after greatest existing layer", () => {
      const url = new IpsumURL(
        new URL(
          "http://www.ipsumdomain.com/journal?l1=arc_detail,12341234,abcdabcd"
        )
      )
        .getJournalUrl()
        .addLayer({
          type: "arc_detail",
          objectId: "56785678",
          connectionId: "efghefgh",
        });
      expect(url.getLayers()).toEqual([
        { type: "arc_detail", objectId: "12341234", connectionId: "abcdabcd" },
        { type: "arc_detail", objectId: "56785678", connectionId: "efghefgh" },
      ]);
    });

    it("adding layer skips irrelevant params", () => {
      const url = new IpsumURL(
        new URL(
          "http://www.ipsumdomain.com/journal?l1=arc_detail,12341234,abcdabcd&la=irrelevant"
        )
      )
        .getJournalUrl()
        .addLayer({
          type: "arc_detail",
          objectId: "56785678",
          connectionId: "efghefgh",
        });
      expect(url.getLayers()).toEqual([
        { type: "arc_detail", objectId: "12341234", connectionId: "abcdabcd" },
        { type: "arc_detail", objectId: "56785678", connectionId: "efghefgh" },
      ]);
    });
  });
});
