import { gql } from "@apollo/client";
import { createArc } from "util/apollo/api/arcs";
import { client, initializeState } from "util/apollo/client";

jest.mock("../../autosave");

describe("Arc resolvers", () => {
  beforeEach(() => {
    initializeState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  describe("root queries", () => {
    beforeEach(() => {
      createArc({ name: "arc 2" });
      createArc({ name: "arc 1" });
      createArc({ name: "arc 3" });
    });

    it("should sort arc results alphabetically descending", () => {
      const result = client.readQuery({
        query: gql(`
          query ReadArcs {
            arcs(sort: ALPHA_DESC) {
              id
              name
            }
          }
        `),
      });

      expect(result.arcs).toEqual([
        expect.objectContaining({ name: "arc 1" }),
        expect.objectContaining({ name: "arc 2" }),
        expect.objectContaining({ name: "arc 3" }),
      ]);
    });

    it("should sort arc results alphabetically ascending", () => {
      const result = client.readQuery({
        query: gql(`
          query ReadArcs {
            arcs(sort: ALPHA_ASC) {
              id
              name
            }
          }
        `),
      });

      expect(result.arcs).toEqual([
        expect.objectContaining({ name: "arc 3" }),
        expect.objectContaining({ name: "arc 2" }),
        expect.objectContaining({ name: "arc 1" }),
      ]);
    });
  });
});
