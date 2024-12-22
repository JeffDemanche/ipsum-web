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
    test("should resolve srsCard", () => {});
  });

  describe.skip("field queries", () => {});
});
