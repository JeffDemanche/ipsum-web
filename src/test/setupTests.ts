import "@testing-library/jest-dom/extend-expect";
import { cleanup } from "@testing-library/react";

global.afterEach(() => {
  cleanup();
});
