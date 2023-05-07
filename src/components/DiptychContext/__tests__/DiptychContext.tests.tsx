import { render } from "@testing-library/react";
import React, { useContext, useEffect } from "react";
import { dataToSearchParams, URLLayer } from "util/url";
import { searchParamsToData } from "util/url/urls";
import { DiptychContext, DiptychProvider } from "../DiptychContext";
import { Diptych } from "../types";

const navigateSpy = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => navigateSpy,
  useLocation: jest.fn(),
}));

describe("DiptychContext", () => {
  const setup = ({
    initialUrlLayers,
    action,
  }: {
    initialUrlLayers: URLLayer[];
    action?: (context: Diptych) => void;
  }) => {
    jest.resetAllMocks();

    const url = new URL("http://www.test.com");
    url.search = dataToSearchParams<"journal">({
      layers: initialUrlLayers,
    });

    const Consumer: React.FunctionComponent = () => {
      const context = useContext(DiptychContext);

      useEffect(() => {
        action?.(context);
      }, [context]);

      return <></>;
    };

    delete window.location;
    // @ts-expect-error types, idk
    window.location = { href: url.toString() };

    render(
      <DiptychProvider>
        <Consumer></Consumer>
      </DiptychProvider>
    );

    return {};
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("setLayer", () => {
    it("navigates when setting second layer details", () => {
      const initialUrlLayers: URLLayer[] = [
        {
          type: "daily_journal",
        },
        {
          type: "arc_detail",
          connectionId: "layer1_c_id",
          arcId: "layer1_a_id",
        },
      ];
      const newLayer1: URLLayer = {
        type: "arc_detail",
        connectionId: "layer2_c_id",
        arcId: "layer2_a_id",
      };
      setup({
        initialUrlLayers,
        action: (context) => {
          context.setLayer(1, newLayer1);
        },
      });
      const layers = searchParamsToData<"journal">(
        navigateSpy.mock.calls[0][0].search
      ).layers;
      expect(layers).toEqual([
        {
          type: "daily_journal",
        },
        {
          type: "arc_detail",
          connectionId: "layer2_c_id",
          arcId: "layer2_a_id",
        },
      ] as URLLayer[]);
    });

    it("navigates and closes second layer when setting first layer details", () => {
      const initialUrlLayers: URLLayer[] = [
        {
          type: "daily_journal",
        },
        {
          type: "arc_detail",
          connectionId: "layer1_c_id",
          arcId: "layer1_a_id",
        },
      ];
      const newLayer1: URLLayer = {
        type: "daily_journal",
      };
      setup({
        initialUrlLayers,
        action: (context) => {
          context.setLayer(0, newLayer1);
        },
      });
      const layers = searchParamsToData<"journal">(
        navigateSpy.mock.calls[0][0].search
      ).layers;
      expect(layers).toEqual([newLayer1] as URLLayer[]);
    });
  });

  describe("setConnection", () => {
    it("navigates when setting connection second layer connection, changes second layer to ConnectionOnly", () => {
      const initialUrlLayers: URLLayer[] = [
        {
          type: "daily_journal",
        },
        {
          type: "arc_detail",
          connectionId: "layer1_c_id",
          arcId: "layer1_a_id",
        },
      ];
      setup({
        initialUrlLayers,
        action: (context) => {
          context.setConnection(1, "layer2_c_id");
        },
      });
      const layers = searchParamsToData<"journal">(
        navigateSpy.mock.calls[0][0].search
      ).layers;
      expect(layers).toEqual([
        { type: "daily_journal" },
        { type: "connection_only", connectionId: "layer2_c_id" },
      ] as URLLayer[]);
    });
  });

  describe("setTopConnection", () => {
    it("navigates to override current top layer if that layer is ConnectionOnly", () => {
      const initialUrlLayers: URLLayer[] = [
        {
          type: "daily_journal",
        },
        {
          type: "connection_only",
          connectionId: "old_c_id",
        },
      ];
      setup({
        initialUrlLayers,
        action: (context) => {
          context.setTopConnection("new_c_id");
        },
      });
      const layers = searchParamsToData<"journal">(
        navigateSpy.mock.calls[0][0].search
      ).layers;
      expect(layers).toEqual([
        { type: "daily_journal" },
        { type: "connection_only", connectionId: "new_c_id" },
      ] as URLLayer[]);
    });

    it("navigates to create new layer if topmost layer isn't ConnectionOnly", () => {
      const initialUrlLayers: URLLayer[] = [
        {
          type: "daily_journal",
        },
        {
          type: "arc_detail",
          connectionId: "layer1_c_id",
          arcId: "layer1_a_id",
        },
      ];
      setup({
        initialUrlLayers,
        action: (context) => {
          context.setTopConnection("layer2_c_id");
        },
      });
      const layers = searchParamsToData<"journal">(
        navigateSpy.mock.calls[0][0].search
      ).layers;
      expect(layers).toEqual([
        { type: "daily_journal" },
        {
          type: "arc_detail",
          connectionId: "layer1_c_id",
          arcId: "layer1_a_id",
        },
        { type: "connection_only", connectionId: "layer2_c_id" },
      ] as URLLayer[]);
    });
  });
});
