import React from "react";
import { InMemoryState } from "../in-memory-schema";
import { createAllIndices } from "../indices";
import {
  initializeDefaultDocument,
  initializeDefaultInMemoryState,
} from "../in-memory-state";
import { useFindDocuments } from "../useFindDocuments";
import { MockInMemoryStateProvider } from "./MockInMemoryStateProvider";
import { renderHook } from "@testing-library/react";

describe("useFindDocuments", () => {
  const defaultState: InMemoryState = createAllIndices({
    ...initializeDefaultInMemoryState(),
    arc: {
      arc_1: {
        ...initializeDefaultDocument("arc"),
        id: "arc_1",
        color: 123,
      },
      arc_2: {
        ...initializeDefaultDocument("arc"),
        id: "arc_2",
        color: 0,
      },
      arc_3: {
        ...initializeDefaultDocument("arc"),
        id: "arc_3",
        color: 123,
      },
    },
    highlight: {
      highlight_1: {
        ...initializeDefaultDocument("highlight"),
        id: "highlight_1",
        entryKey: "1/1/2020",
      },
      highlight_2: {
        ...initializeDefaultDocument("highlight"),
        id: "highlight_2",
        entryKey: "6/6/2020",
      },

      highlight_3: {
        ...initializeDefaultDocument("highlight"),
        id: "highlight_3",
        entryKey: "6/6/2020",
      },
    },
  });

  const defaultStateWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <MockInMemoryStateProvider state={defaultState}>
        {children}
      </MockInMemoryStateProvider>
    );
  };

  it("finds unindexed documents", () => {
    const { result } = renderHook(
      () =>
        useFindDocuments({
          collection: "arc",
          fieldName: "color",
          fieldValue: 123,
        }),
      { wrapper: defaultStateWrapper }
    );
    expect(result.current.documents).toEqual(["arc_1", "arc_3"]);
  });

  it("finds indexed documents", () => {
    const { result } = renderHook(
      () =>
        useFindDocuments({
          collection: "highlight",
          fieldName: "entryKey",
          fieldValue: "6/6/2020",
        }),
      { wrapper: defaultStateWrapper }
    );
    expect(result.current.documents).toEqual(["highlight_2", "highlight_3"]);
  });
});
