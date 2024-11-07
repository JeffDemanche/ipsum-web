import { client } from "util/apollo/client";
import { dangerous_initializeProjectState } from "util/state/IpsumStateContext";

describe("Highlight resolvers", () => {
  beforeEach(() => {
    dangerous_initializeProjectState();
  });

  afterEach(async () => {
    await client.clearStore();
    jest.restoreAllMocks();
  });

  describe("fields", () => {
    it("should resolve srsCard", () => {});
  });

  describe.skip("field queries", () => {});
});
