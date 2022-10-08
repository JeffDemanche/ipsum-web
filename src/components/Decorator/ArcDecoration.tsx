import React, { useContext, useMemo, useRef } from "react";
import styles from "./ArcDecoration.less";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { ContentState } from "draft-js";
import { ArcSelectionContext } from "components/ArcSelection/ArcSelectionContext";
import { isSubset } from "util/set";
import { JournalHotkeysContext } from "components/JournalHotkeys/JournalHotkeysContext";
import { ArcDisambiguator } from "components/ArcDisambiguator/ArcDisambiguator";
import { IpsumArcColor } from "util/colors";

// Draft doesn't provide this type, this is inferred from logging the props
// value.
interface DecoratorProps {
  blockKey: string;
  contentState: ContentState;
  decoratedText: string;
  end: number;
  entityKey: string;
  offsetKey: string;
  start: number;
  children: React.ReactNode;
}

/**
 * Gets applied in place of any text that `decorator.ts` has determined to have
 * the "ARC" entity applied to it.
 */
export const ArcDecoration: React.FC<DecoratorProps> = (props) => {
  const arcIds = props.contentState.getEntity(props.entityKey).getData()
    .arcIds as string[];

  const { ctrlKey } = useContext(JournalHotkeysContext);
  const { hoveredArcIds, setHoveredArcIds, selectedArcIds, setSelectedArcIds } =
    useContext(ArcSelectionContext);
  const { state } = useContext(InMemoryStateContext);

  const arcs = arcIds?.map((id) => state.arcs[id]).filter((arc) => !!arc) ?? [];

  const isHovered = useMemo(
    () =>
      hoveredArcIds?.length &&
      isSubset(new Set(hoveredArcIds), new Set(arcIds)),
    [arcIds, hoveredArcIds]
  );

  const allArcsSelected = useMemo(
    () => selectedArcIds && isSubset(new Set(arcIds), new Set(selectedArcIds)),
    [arcIds, selectedArcIds]
  );

  const someArcsSelected = useMemo(
    () => selectedArcIds && isSubset(new Set(selectedArcIds), new Set(arcIds)),
    [arcIds, selectedArcIds]
  );

  const isHighlighted = isHovered || someArcsSelected;

  const boxShadow = arcs.reduce(
    (acc, cur, i): string =>
      `${acc} 0 ${(i + 1) * 2}px 0 0 ${new IpsumArcColor(cur.color).toHsla(
        100,
        50,
        isHighlighted ? 0.4 : 0.25
      )}
      ${i === arcs.length - 1 ? "" : ","}`,
    ""
  );

  const avgHue = Math.round(
    arcs.reduce((acc, cur) => acc + cur.color, 0) / arcs.length
  );

  const backgroundColor = arcs
    ? new IpsumArcColor(avgHue).toHsla(100, 50, isHighlighted ? 0.2 : 0.05)
    : `rgba(0, 0, 0, ${isHighlighted ? 0.2 : 0.05})`;

  const cursor = ctrlKey ? "pointer" : undefined;

  const ref = useRef<HTMLSpanElement>(null);
  const disambiguatorOpen = !!(allArcsSelected && arcIds.length > 1);

  return (
    <>
      <span
        ref={ref}
        aria-details={arcs.map((arc) => `${arc.name}`).join(" ")}
        onMouseEnter={() => {
          setHoveredArcIds(arcIds);
        }}
        onMouseLeave={() => {
          setHoveredArcIds(undefined);
        }}
        onClick={() => {
          if (ctrlKey) {
            setSelectedArcIds(arcIds);
          }
        }}
        className={styles.arc}
        style={{ cursor, boxShadow, backgroundColor }}
      >
        {props.children}
      </span>
      <ArcDisambiguator
        arcIds={arcIds}
        onArcSelected={(arcId: string) => {
          setSelectedArcIds([arcId]);
        }}
        open={disambiguatorOpen}
        anchorEl={ref.current}
        onClickAway={() => {
          setSelectedArcIds(undefined);
        }}
      ></ArcDisambiguator>
    </>
  );
};
