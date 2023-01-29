import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ArcDisambiguator } from "../ArcDisambiguator";
import { MockInMemoryStateProvider } from "state/in-memory/__tests__/MockInMemoryStateProvider";

const TestDisambiguator: React.FunctionComponent<{
  open: boolean;
  onArcSelected?: (arcId: string) => void;
}> = ({ open, onArcSelected }) => {
  const [anchor, setAnchor] = useState<HTMLDivElement>(null);
  return (
    <MockInMemoryStateProvider
      state={{
        arc: {
          arc_1: { id: "arc_1", color: 0, name: "Arc one" },
          arc_2: { id: "arc_2", color: 100, name: "Arc two" },
        },
      }}
    >
      <div
        ref={(el) => {
          setAnchor(el);
        }}
      ></div>
      {anchor && (
        <ArcDisambiguator
          open={open}
          anchorEl={anchor}
          onArcSelected={onArcSelected}
          arcIds={["arc_1", "arc_2"]}
        ></ArcDisambiguator>
      )}
    </MockInMemoryStateProvider>
  );
};

describe("ArcDisambiguator", () => {
  it("has links for both arcs with correct hues", async () => {
    const { unmount } = render(<TestDisambiguator open></TestDisambiguator>);

    const arc1 = await screen.findByRole("link", { name: "Arc one" });
    const arc2 = await screen.findByRole("link", { name: "Arc two" });

    expect(arc1).toBeInTheDocument();
    expect(arc1.style.textDecorationColor).toEqual("rgba(230, 179, 179, 1)");
    expect(arc2).toBeInTheDocument();
    expect(arc2.style.textDecorationColor).toEqual("rgba(195, 230, 179, 1)");

    unmount();
  });

  it("selects arc on click", async () => {
    const mockOnArcSelected = jest.fn();

    const { unmount } = render(
      <TestDisambiguator
        open
        onArcSelected={mockOnArcSelected}
      ></TestDisambiguator>
    );

    expect(mockOnArcSelected).not.toHaveBeenCalled();
    const arc1 = await screen.findByRole("link", { name: "Arc one" });
    fireEvent.click(arc1);
    expect(mockOnArcSelected).toHaveBeenCalledWith("arc_1");

    unmount();
  });
});
