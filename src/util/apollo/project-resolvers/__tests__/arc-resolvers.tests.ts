import { gql } from "@apollo/client";
import { createArc } from "util/api/project-actions/arc/create-arc";
import { client } from "util/apollo/client";
import { PROJECT_STATE } from "util/state";
import { dangerous_initializeProjectState } from "util/state/IpsumStateContext";

describe("Arc resolvers", () => {
  beforeEach(() => {
    dangerous_initializeProjectState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  describe("root queries", () => {
    beforeEach(() => {
      createArc({ name: "arc 2" }, { projectState: PROJECT_STATE });
      createArc({ name: "arc 1" }, { projectState: PROJECT_STATE });
      createArc({ name: "arc 3" }, { projectState: PROJECT_STATE });
    });

    test("should sort arc results alphabetically descending", () => {
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

    test("should sort arc results alphabetically ascending", () => {
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
