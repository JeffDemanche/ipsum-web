import { render } from "@testing-library/react";
import React from "react";
import { dataToSearchParams, URLLayer } from "util/url";
import { searchParamsToData } from "util/url/urls";
import { DiptychProvider } from "../DiptychContext";

const navigateSpy = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => navigateSpy,
  useLocation: jest.fn(),
}));

describe("DiptychContext", () => {
  const setup = ({
    initialUrlLayers,
    children,
  }: {
    initialUrlLayers: URLLayer[];
    children: React.ReactNode;
  }) => {
    jest.resetAllMocks();

    const url = new URL("http://www.test.com");
    url.search = dataToSearchParams<"journal">({
      layers: initialUrlLayers,
    });

    delete window.location;
    // @ts-expect-error types, idk
    window.location = { href: url.toString() };

    const { rerender } = render(<DiptychProvider>{children}</DiptychProvider>);

    return {
      rerender: () => {
        rerender(<DiptychProvider>{children}</DiptychProvider>);
      },
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const navigateCallToData = (call: string) => {
    return searchParamsToData<"journal">(call.split("?")[1]);
  };

  it("initially adds daily journal layer if the URL doesn't contain any layers initially", () => {
    setup({
      initialUrlLayers: [],
      children: <></>,
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateCallToData(navigateSpy.mock.calls[0][0])).toEqual({
      layers: [{ type: "daily_journal" }],
    });
  });
});
