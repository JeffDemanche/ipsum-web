import { gql } from "@apollo/client";
import { client } from "util/apollo";
import { createDay } from "util/apollo/api/day";
import { initializeState } from "util/apollo/client";

jest.mock("../../autosave");

describe("Day resolvers", () => {
  beforeEach(() => {
    initializeState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  it("should get a day", () => {
    createDay("1/1/2021");

    const result = client.readQuery({
      query: gql(`
        query ReadDay($day: String!) {
          day(day: $day) {
            day
          }
        }
      `),
      variables: {
        day: "1/1/2021",
      },
    });

    expect(result).toEqual({
      day: {
        __typename: "Day",
        day: "1/1/2021",
      },
    });
  });
});
