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
    describe("get layers", () => {
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
          {
            type: "arc_detail",
            objectId: "12341234",
            connectionId: "abcdabcd",
          },
          {
            type: "arc_detail",
            objectId: "56785678",
            connectionId: "efghefgh",
          },
        ]);
      });
    });

    describe("push layers", () => {
      it("pushes layer if no existing layers", () => {
        const url = new IpsumURL(new URL("http://www.ipsumdomain.com/journal"))
          .getJournalUrl()
          .pushLayer({
            type: "arc_detail",
            objectId: "56785678",
            connectionId: "efghefgh",
          });
        expect(url.getLayers()).toEqual([
          {
            type: "arc_detail",
            objectId: "56785678",
            connectionId: "efghefgh",
          },
        ]);
      });

      it("pushes layer after greatest existing layer", () => {
        const url = new IpsumURL(
          new URL(
            "http://www.ipsumdomain.com/journal?l1=arc_detail,12341234,abcdabcd"
          )
        )
          .getJournalUrl()
          .pushLayer({
            type: "arc_detail",
            objectId: "56785678",
            connectionId: "efghefgh",
          });
        expect(url.getLayers()).toEqual([
          {
            type: "arc_detail",
            objectId: "12341234",
            connectionId: "abcdabcd",
          },
          {
            type: "arc_detail",
            objectId: "56785678",
            connectionId: "efghefgh",
          },
        ]);
      });

      it("pushing layer skips irrelevant params", () => {
        const url = new IpsumURL(
          new URL(
            "http://www.ipsumdomain.com/journal?l1=arc_detail,12341234,abcdabcd&la=irrelevant"
          )
        )
          .getJournalUrl()
          .pushLayer({
            type: "arc_detail",
            objectId: "56785678",
            connectionId: "efghefgh",
          });
        expect(url.getLayers()).toEqual([
          {
            type: "arc_detail",
            objectId: "12341234",
            connectionId: "abcdabcd",
          },
          {
            type: "arc_detail",
            objectId: "56785678",
            connectionId: "efghefgh",
          },
        ]);
      });
    });

    describe("set top layer", () => {
      it("just pushes layer if index is 0", () => {
        const url = new IpsumURL(
          new URL(
            "http://www.ipsumdomain.com/journal?l1=arc_detail,12341234,abcdabcd"
          )
        )
          .getJournalUrl()
          .setTopLayer(0, {
            type: "arc_detail",
            objectId: "56785678",
            connectionId: "efghefgh",
          }).url;

        expect(decodeURIComponent(url.toString())).toEqual(
          "http://www.ipsumdomain.com/journal?l1=arc_detail,12341234,abcdabcd&l2=arc_detail,56785678,efghefgh"
        );
      });

      it("inserts a new layer at position 2", () => {
        const url = new IpsumURL(
          new URL(
            "http://www.ipsumdomain.com/journal?l1=arc_detail,123,abc&l2=arc_detail,456,def&l3=arc_detail,789,ghi"
          )
        )
          .getJournalUrl()
          .setTopLayer(2, {
            type: "arc_detail",
            objectId: "ins_obj",
            connectionId: "ins_con",
          }).url;

        expect(decodeURIComponent(url.toString())).toEqual(
          "http://www.ipsumdomain.com/journal?l1=arc_detail,123,abc&l2=arc_detail,ins_obj,ins_con"
        );
      });

      it("index above highest layer just pushes layer", () => {
        const url = new IpsumURL(
          new URL("http://www.ipsumdomain.com/journal?l1=arc_detail,123,abc")
        )
          .getJournalUrl()
          .setTopLayer(12, {
            type: "arc_detail",
            objectId: "ins_obj",
            connectionId: "ins_con",
          }).url;

        expect(decodeURIComponent(url.toString())).toEqual(
          "http://www.ipsumdomain.com/journal?l1=arc_detail,123,abc&l2=arc_detail,ins_obj,ins_con"
        );
      });

      it("pushes at first layer if no existing layers (with irrelevant params)", () => {
        const url = new IpsumURL(
          new URL("http://www.ipsumdomain.com/journal?la=irrelevant")
        )
          .getJournalUrl()
          .setTopLayer(12, {
            type: "arc_detail",
            objectId: "ins_obj",
            connectionId: "ins_con",
          }).url;

        expect(decodeURIComponent(url.toString())).toEqual(
          "http://www.ipsumdomain.com/journal?la=irrelevant&l1=arc_detail,ins_obj,ins_con"
        );
      });

      it("if no layer is provided, the layer specified becomes the top", () => {
        const url = new IpsumURL(
          new URL(
            "http://www.ipsumdomain.com/journal?l1=arc_detail,123,abc&l2=arc_detail,456,def&l3=arc_detail,789,ghi"
          )
        )
          .getJournalUrl()
          .setTopLayer(2).url;

        expect(decodeURIComponent(url.toString())).toEqual(
          "http://www.ipsumdomain.com/journal?l1=arc_detail,123,abc&l2=arc_detail,456,def"
        );
      });
    });
  });
});
