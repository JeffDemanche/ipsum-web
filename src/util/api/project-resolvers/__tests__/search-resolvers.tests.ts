import { client } from "util/apollo/client";
import { dangerous_initializeProjectState } from "util/state/IpsumStateContext";

describe("Search resolvers", () => {
  beforeEach(() => {
    dangerous_initializeProjectState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  describe("root queries", () => {
    test.todo("search queries");
  });
});
