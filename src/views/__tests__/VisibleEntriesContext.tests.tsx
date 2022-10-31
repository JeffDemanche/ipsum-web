import { render } from "@testing-library/react";
import React, { useContext } from "react";
import { MockInMemoryStateProvider } from "state/in-memory/__tests__/MockInMemoryStateProvider";
import { stringifyContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
import { createEditorStateFromFormat } from "util/__tests__/editor-utils";
import {
  VisibleEntries,
  VisibleEntriesContext,
  VisibleEntriesProvider,
} from "views/VisibleEntriesContext";
import { useSearchParams } from "react-router-dom";

jest.mock("react-router-dom");

const Consumer: React.FC<{ valueFn: (value: VisibleEntries) => void }> = ({
  valueFn,
}) => {
  const contextValues = useContext(VisibleEntriesContext);

  valueFn(contextValues);

  return <div></div>;
};

describe("VisibleEntriesContext", () => {
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
      <MockInMemoryStateProvider
        state={{
          entries: {
            "10/01/2022": {
              entryKey: "10/01/2022",
              contentState: stringifyContentState(
                createEditorStateFromFormat("hello world 1").getCurrentContent()
              ),
              date: IpsumDateTime.fromString(
                "10/01/2022",
                "entry-printed-date"
              ),
            },
            "10/03/2022": {
              entryKey: "10/03/2022",
              contentState: stringifyContentState(
                createEditorStateFromFormat("hello world 2").getCurrentContent()
              ),
              date: IpsumDateTime.fromString(
                "10/03/2022",
                "entry-printed-date"
              ),
            },
          },
        }}
      >
        <VisibleEntriesProvider>
          <Consumer valueFn={valueFn}></Consumer>
        </VisibleEntriesProvider>
      </MockInMemoryStateProvider>
    );

    expect(valueFn).toHaveBeenCalledTimes(1);
    expect(valueFn.mock.calls[0][0]).toMatchObject({
      visibleEntryKeys: ["10/3/2022", "10/1/2022"],
    });
  });
});
