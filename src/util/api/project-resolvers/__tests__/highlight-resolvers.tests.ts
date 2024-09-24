import { client } from "util/apollo/client";
import { IpsumDateTime } from "util/dates";
import { dangerous_initializeProjectState } from "util/state/IpsumStateContext";

describe("Highlight resolvers", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let todaySpy = jest.spyOn(IpsumDateTime, "today");

  beforeEach(() => {
    dangerous_initializeProjectState();

    todaySpy = jest.spyOn(IpsumDateTime, "today");
  });

  afterEach(async () => {
    await client.clearStore();
    jest.restoreAllMocks();
  });

  describe("root queries", () => {
    test.todo("highlight queries");
  });

  describe.skip("field queries", () => {});
});
