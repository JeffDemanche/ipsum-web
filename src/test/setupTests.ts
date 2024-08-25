import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";

// @ts-expect-error Untyped
global.IS_REACT_ACT_ENVIRONMENT = true;

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.afterEach(() => {
  cleanup();
});
