import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";

import { EntryEditor } from "..";

jest.mock("util/placeholders", () => ({
  placeholderForDate: () => "placeholder",
}));

describe("EntryEditor", () => {
  describe("entry state lifecycle", () => {
    it("should create a new entry after typing in an editor with no entryKey", async () => {});
  });
});
