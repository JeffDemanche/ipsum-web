import { render } from "@testing-library/react";
import React, { useContext, useEffect } from "react";
import { dataToSearchParams } from "util/url";
import { DiptychContext, DiptychProvider } from "../DiptychContext";
import { Diptych } from "../types";

const navigateSpy = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => navigateSpy,
}));

describe("DiptychContext", () => {
  const setup = ({ url }: { url: URL }) => {
    jest.resetAllMocks();

    const Consumer: React.FunctionComponent<{
      onContextUpdate: (context: Diptych) => void;
      action?: (context: Diptych) => void;
    }> = ({ onContextUpdate, action }) => {
      const context = useContext(DiptychContext);

      useEffect(() => {
        onContextUpdate(context);
      }, [context, onContextUpdate]);

      useEffect(() => {
        action?.(context);
      }, [action, context]);

      return <></>;
    };

    delete window.location;
    // @ts-expect-error types, idk
    window.location = { href: url.toString() };

    return { Consumer };
  };

  it("gets layers with one ArcDetail including base DailyJournal layer", () => {
    const url = new URL("http://www.test.com");
    url.search = dataToSearchParams<"journal">({
      layers: [
        {
          type: "arc_detail",
          connectionId: "layer1_c_id",
          objectId: "layer1_o_id",
        },
      ],
    });

    const { Consumer } = setup({ url });

    const onContextUpdate = jest.fn();

    render(
      <DiptychProvider>
        <Consumer onContextUpdate={onContextUpdate}></Consumer>
      </DiptychProvider>
    );

    expect(onContextUpdate.mock.calls[0][0].layers).toHaveLength(2);
    expect(onContextUpdate.mock.calls[0][0].layers[0].type).toEqual(
      "DailyJournal"
    );
    expect(onContextUpdate.mock.calls[0][0].layers[1]).toEqual({
      type: "ArcDetail",
      arcId: "layer1_o_id",
      diptychMedian: {
        connectionId: "layer1_c_id",
      },
    });
  });

  it("closes first opened ArcDetail layer and goes back to DailyJournal (don't keep connection)", () => {
    const url = new URL("http://www.test.com");
    url.search = dataToSearchParams<"journal">({
      layers: [
        {
          type: "arc_detail",
          connectionId: "layer1_c_id",
          objectId: "layer1_o_id",
        },
      ],
    });

    const { Consumer } = setup({ url });

    const onContextUpdate = jest.fn();

    render(
      <DiptychProvider>
        <Consumer
          onContextUpdate={onContextUpdate}
          action={(context) => {
            context.closeLayer(1, false);
          }}
        ></Consumer>
      </DiptychProvider>
    );

    expect(navigateSpy.mock.calls[0][0].search).toEqual("");
  });
});
