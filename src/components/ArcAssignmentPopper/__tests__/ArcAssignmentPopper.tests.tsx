import { fireEvent, getByRole, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { MockInMemoryStateProvider } from "state/in-memory/__tests__/MockInMemoryStateProvider";
import { useSearchArcs } from "util/hooks/useSearchArcs";
import { ArcAssignmentPopper } from "../ArcAssignmentPopper";

jest.mock("util/hooks/useSearchArcs");

const TestPopper = ({
  open = true,
  editorKey = "editorKey",
}: {
  open?: boolean;
  editorKey?: string;
}) => {
  const [anchor, setAnchor] = useState<HTMLDivElement>(null);
  return (
    <MockInMemoryStateProvider
      state={{
        arcs: {
          red_arc_id: {
            id: "red_arc_id",
            name: "red_arc",
            color: 0,
          },
          blue_arc_id: {
            id: "blue_arc_id",
            name: "blue_arc",
            color: 127,
          },
        },
      }}
    >
      <div
        ref={(el) => {
          setAnchor(el);
        }}
      ></div>
      {anchor && (
        <ArcAssignmentPopper
          open={open}
          anchorEl={anchor}
          editorKey={editorKey}
        ></ArcAssignmentPopper>
      )}
    </MockInMemoryStateProvider>
  );
};

describe("ArcAssignmentPopper", () => {
  beforeEach(() => {
    jest.mocked(useSearchArcs).mockReturnValue({
      returnedArcs: [
        { id: "red_arc_id", name: "red_arc", color: 0 },
        { id: "blue_arc_id", name: "blue_arc", color: 127 },
      ],
    });
  });

  it("renders all arc tokens if input is empty", () => {
    const { unmount } = render(
      <TestPopper editorKey="test_editor"></TestPopper>
    );

    expect(screen.getAllByRole("link").length).toEqual(2);
    expect(screen.getByRole("link", { name: "red_arc" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "blue_arc" })).toBeInTheDocument();

    unmount();
  });

  it("clears input field when open prop changes", () => {
    const { unmount, rerender } = render(<TestPopper open></TestPopper>);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test" } });

    expect(screen.getByRole("textbox")).toHaveValue("test");

    rerender(<TestPopper open={false}></TestPopper>);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    rerender(<TestPopper open={true}></TestPopper>);

    expect(screen.getByRole("textbox")).toHaveValue("");

    unmount();
  });
});