import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { HighlightDisambiguator } from "../HighlightDisambiguator";
import { MockInMemoryStateProvider } from "state/in-memory/__tests__/MockInMemoryStateProvider";

const TestDisambiguator: React.FunctionComponent<{
  open: boolean;
  onArcSelected?: (arcId: string) => void;
}> = ({ open, onArcSelected: onHighlightSelected }) => {
  const [anchor, setAnchor] = useState<HTMLDivElement>(null);
  return (
    <MockInMemoryStateProvider
      state={{
        arc: {
          arc_1: { id: "arc_1", color: 0, name: "Arc one" },
          arc_2: { id: "arc_2", color: 100, name: "Arc two" },
        },
        arc_assignment: {
          highlight_1: { arcId: "arc_1", entryKey: "", id: "highlight_1" },
          highlight_2: { arcId: "arc_2", entryKey: "", id: "highlight_2" },
        },
      }}
    >
      <div
        ref={(el) => {
          setAnchor(el);
        }}
      ></div>
      {anchor && (
        <HighlightDisambiguator
          open={open}
          anchorEl={anchor}
          onHighlightSelected={onHighlightSelected}
          highlightIds={["highlight_1", "highlight_2"]}
        ></HighlightDisambiguator>
      )}
    </MockInMemoryStateProvider>
  );
};

describe("HighlightDisambiguator", () => {
  it("has links for both arcs with correct hues", async () => {
    const { unmount } = render(<TestDisambiguator open></TestDisambiguator>);

    const arc1 = await screen.findByRole("link", { name: "Arc one" });
    const arc2 = await screen.findByRole("link", { name: "Arc two" });

    expect(arc1).toBeInTheDocument();
    expect(arc1.style.textDecorationColor).toEqual("rgba(115, 38, 38, 1)");
    expect(arc2).toBeInTheDocument();
    expect(arc2.style.textDecorationColor).toEqual("rgba(64, 115, 38, 1)");

    unmount();
  });

  it("selects arc on click", async () => {
    const mockOnHighlightSelected = jest.fn();

    const { unmount } = render(
      <TestDisambiguator
        open
        onArcSelected={mockOnHighlightSelected}
      ></TestDisambiguator>
    );

    expect(mockOnHighlightSelected).not.toHaveBeenCalled();
    const arc1 = await screen.findByRole("link", { name: "Arc one" });
    fireEvent.click(arc1);
    expect(mockOnHighlightSelected).toHaveBeenCalledWith("highlight_1");

    unmount();
  });
});
