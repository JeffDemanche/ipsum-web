import { render } from "@testing-library/react";
import React, { useContext } from "react";
import { stringifyContentState } from "util/content-state";
import { createEditorStateFromFormat } from "util/__tests__/editor-utils";
import {
  VisibleEntries,
  VisibleEntriesContext,
  VisibleEntriesProvider,
} from "components/VisibleEntriesContext/VisibleEntriesContext";
import { useSearchParams } from "react-router-dom";
import { mockEntries } from "util/apollo/__tests__/apollo-test-utils";
import { ApolloProvider } from "@apollo/client";
import { client } from "util/apollo";
import { IpsumTimeMachine } from "util/diff";

jest.mock("react-router-dom");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useLocation: jest.fn(),
}));

const Consumer: React.FC<{ valueFn: (value: VisibleEntries) => void }> = ({
  valueFn,
}) => {
  const contextValues = useContext(VisibleEntriesContext);

  valueFn(contextValues);

  return <div></div>;
};

describe("VisibleEntriesContext", () => {
  beforeEach(() => {
    mockEntries({
      "10/01/2022": {
        __typename: "Entry",
        entryKey: "10/01/2022",
        trackedContentState: IpsumTimeMachine.create(
          stringifyContentState(
            createEditorStateFromFormat("hello world 1").getCurrentContent()
          )
        ).toString(),
      },
      "10/03/2022": {
        __typename: "Entry",
        entryKey: "10/03/2022",
        trackedContentState: IpsumTimeMachine.create(
          stringifyContentState(
            createEditorStateFromFormat("hello world 2").getCurrentContent()
          )
        ).toString(),
      },
    });
  });

  it("returns entries between startDate and endDate params", () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      {
        get: (param: string) => {
          if (param === "startDate") return "10-01-2022";
          if (param === "endDate") return "10-31-2022";
        },
      },
    ]);

    const valueFn = jest.fn();

    render(
      <ApolloProvider client={client}>
        <VisibleEntriesProvider>
          <Consumer valueFn={valueFn}></Consumer>
        </VisibleEntriesProvider>
      </ApolloProvider>
    );

    expect(valueFn).toHaveBeenCalledTimes(1);
    expect(valueFn.mock.calls[0][0]).toMatchObject({
      visibleEntryKeys: ["10/3/2022", "10/1/2022"],
    });
  });
});
