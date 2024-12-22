import { gql } from "@apollo/client";
import { createEntry } from "util/api/project-actions/entry/create-entry";
import { createHighlight } from "util/api/project-actions/highlight/create-highlight";
import { EntryType } from "util/apollo";
import { client } from "util/apollo/client";
import {
  dangerous_initializeProjectState,
  PROJECT_STATE,
} from "util/state/IpsumStateContext";

describe("Search resolvers", () => {
  beforeEach(() => {
    dangerous_initializeProjectState();
  });

  afterEach(async () => {
    await client.clearStore();
  });

  describe("root queries", () => {
    describe("searchHighlights", () => {
      test("should return result of filter program", async () => {
        createEntry(
          {
            entryKey: "entry",
            entryType: EntryType.Journal,
            htmlString: "test",
          },
          { projectState: PROJECT_STATE }
        );

        createHighlight(
          { id: "highlight_1", entryKey: "entry" },
          { projectState: PROJECT_STATE }
        );

        const result = client.readQuery({
          query: gql(`
            query SearchHighlights($program: String!) {
              searchHighlights(program: $program) {
                id
              }
            }
          `),
          variables: { program: "highlights" },
        });

        expect(result).toEqual({
          searchHighlights: [{ __typename: "Highlight", id: "highlight_1" }],
        });
      });
    });
  });
});
