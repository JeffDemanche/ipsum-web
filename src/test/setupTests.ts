import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.afterEach(() => {
  cleanup();
});
