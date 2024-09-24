import { gql } from "@apollo/client";
import { updateDay } from "util/api/project-actions/day/update-day";
import { client } from "util/apollo";
import { IpsumDay } from "util/dates";
import {
  dangerous_initializeProjectState,
  PROJECT_STATE,
} from "util/state/IpsumStateContext";

describe("Day resolvers", () => {
  beforeEach(() => {
    dangerous_initializeProjectState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  it("should get a day", () => {
    updateDay(
      { day: IpsumDay.fromString("1/1/2021", "stored-day") },
      { projectState: PROJECT_STATE }
    );

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
