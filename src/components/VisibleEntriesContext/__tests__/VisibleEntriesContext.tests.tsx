import { render } from "@testing-library/react";
import React, { useContext } from "react";
import {
  VisibleEntries,
  VisibleEntriesContext,
  VisibleEntriesProvider,
} from "components/VisibleEntriesContext/VisibleEntriesContext";
import {
  mockEntries,
  mockJournalEntries,
} from "util/apollo/__tests__/apollo-test-utils";
import { ApolloProvider } from "@apollo/client";
import { client, EntryType } from "util/apollo";
import { dataToSearchParams, searchParamsToData } from "util/url/urls";

jest.mock("react-router-dom");
const navigateSpy = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useLocation: jest.fn(),
  useNavigate: () => navigateSpy,
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
    const url = new URL("http://www.test.com");
    url.search = dataToSearchParams<"journal">({
      layers: [
        {
          type: "daily_journal",
          startDate: "10-01-2022",
          endDate: "10-31-2022",
        },
      ],
    });

    delete window.location;
    // @ts-expect-error types, idk
    window.location = { href: url.toString() };

    mockEntries({
      "9/21/2022": {
        __typename: "Entry",
        entryKey: "9/21/2022",
        trackedContentState: "",
        entryType: EntryType.Journal,
      },
      "10/01/2022": {
        __typename: "Entry",
        entryKey: "10/01/2022",
        trackedContentState: "",
        entryType: EntryType.Journal,
      },
      "10/03/2022": {
        __typename: "Entry",
        entryKey: "10/03/2022",
        trackedContentState: "",
        entryType: EntryType.Journal,
      },
      "11/04/2022": {
        __typename: "Entry",
        entryKey: "11/04/2022",
        trackedContentState: "",
        entryType: EntryType.Journal,
      },
      "11/05/2022": {
        __typename: "Entry",
        entryKey: "11/05/2022",
        trackedContentState: "",
        entryType: EntryType.Journal,
      },
    });
    mockJournalEntries({
      "10/01/2022": { entryKey: "10/01/2022", entry: "10/01/2022" },
      "10/03/2022": { entryKey: "10/03/2022", entry: "10/03/2022" },
      "11/04/2022": { entryKey: "11/04/2022", entry: "11/04/2022" },
      "9/21/2022": { entryKey: "9/21/2022", entry: "9/21/2022" },
      "11/05/2022": { entryKey: "11/05/2022", entry: "11/05/2022" },
    });

    jest.resetAllMocks();
  });

  it("returns entries between startDate and endDate params", () => {
    const valueFn = jest.fn();

    render(
      <ApolloProvider client={client}>
        <VisibleEntriesProvider
          layer={{
            index: 0,
            type: "DailyJournal",
            startDate: "10-01-2022",
            endDate: "10-31-2022",
            urlLayer: {
              type: "daily_journal",
              startDate: "10-01-2022",
              endDate: "10-31-2022",
            },
            diptychMedian: { connectionId: "" },
          }}
        >
          <Consumer valueFn={valueFn}></Consumer>
        </VisibleEntriesProvider>
      </ApolloProvider>
    );

    expect(valueFn).toHaveBeenCalledTimes(1);
    expect(valueFn.mock.calls[0][0]).toMatchObject({
      visibleEntryKeys: ["10/3/2022", "10/1/2022"],
    });
  });

  it("sets startDate when loadMorePrevious is called with count 1", () => {
    const valueFn = jest.fn();

    render(
      <ApolloProvider client={client}>
        <VisibleEntriesProvider
          layer={{
            index: 0,
            type: "DailyJournal",
            startDate: "10-01-2022",
            endDate: "10-31-2022",
            urlLayer: {
              type: "daily_journal",
              startDate: "10-01-2022",
              endDate: "10-31-2022",
            },
            diptychMedian: { connectionId: "" },
          }}
        >
          <Consumer valueFn={valueFn}></Consumer>
        </VisibleEntriesProvider>
      </ApolloProvider>
    );

    valueFn.mock.calls[0][0].loadMorePrevious(1);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    const searchParams = searchParamsToData<"journal">(
      navigateSpy.mock.calls[0][0].search
    ).layers[0];
    expect(
      searchParams.type === "daily_journal" && searchParams.startDate
    ).toEqual("09-21-2022");
  });

  it("sets endDate when loadMoreNext is called with count 1", () => {
    const valueFn = jest.fn();

    render(
      <ApolloProvider client={client}>
        <VisibleEntriesProvider
          layer={{
            index: 0,
            type: "DailyJournal",
            startDate: "10-01-2022",
            endDate: "10-31-2022",
            urlLayer: {
              type: "daily_journal",
              startDate: "10-01-2022",
              endDate: "10-31-2022",
            },
            diptychMedian: { connectionId: "" },
          }}
        >
          <Consumer valueFn={valueFn}></Consumer>
        </VisibleEntriesProvider>
      </ApolloProvider>
    );

    valueFn.mock.calls[0][0].loadMoreNext(1);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    const searchParams = searchParamsToData<"journal">(
      navigateSpy.mock.calls[0][0].search
    ).layers[0];
    expect(
      searchParams.type === "daily_journal" && searchParams.endDate
    ).toEqual("11-04-2022");
  });

  it("sets endDate when loadMoreNext is called with count 3 (more than exist)", () => {
    const valueFn = jest.fn();

    render(
      <ApolloProvider client={client}>
        <VisibleEntriesProvider
          layer={{
            index: 0,
            type: "DailyJournal",
            startDate: "10-01-2022",
            endDate: "10-31-2022",
            urlLayer: {
              type: "daily_journal",
              startDate: "10-01-2022",
              endDate: "10-31-2022",
            },
            diptychMedian: { connectionId: "" },
          }}
        >
          <Consumer valueFn={valueFn}></Consumer>
        </VisibleEntriesProvider>
      </ApolloProvider>
    );

    valueFn.mock.calls[0][0].loadMoreNext(3);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    const searchParams = searchParamsToData<"journal">(
      navigateSpy.mock.calls[0][0].search
    ).layers[0];
    expect(
      searchParams.type === "daily_journal" && searchParams.endDate
    ).toEqual("11-05-2022");
  });
});
