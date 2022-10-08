import React, { useContext, useMemo, useRef } from "react";
import styles from "./ArcDecoration.less";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { ContentState } from "draft-js";
import { ArcSelectionContext } from "components/ArcSelection/ArcSelectionContext";
import { isSubset } from "util/set";
import { JournalHotkeysContext } from "components/JournalHotkeys/JournalHotkeysContext";
import { ArcDisambiguator } from "components/ArcDisambiguator/ArcDisambiguator";
import { IpsumArcColor, IpsumColor, multiplyIpsumArcColors } from "util/colors";

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

  const entityArcs =
    arcIds?.map((id) => state.arcs[id]).filter((arc) => !!arc) ?? [];
  const hoveredArcs =
    hoveredArcIds?.map((id) => state.arcs[id]).filter((arc) => !!arc) ?? [];
  const selectedArcs =
    selectedArcIds
      ?.filter((selectedArcId) => arcIds.includes(selectedArcId))
      .map((id) => state.arcs[id])
      .filter((arc) => !!arc) ?? [];

  const isHovered = useMemo(
    () =>
      hoveredArcIds?.length &&
      isSubset(new Set(hoveredArcIds), new Set(arcIds)),
    [arcIds, hoveredArcIds]
  );

  const someArcsSelected = !!selectedArcs?.length;

  const multipleArcsSelected = selectedArcs && selectedArcs.length > 1;

  const isHighlighted = isHovered || someArcsSelected;

  const allArcsIpsumColor = multiplyIpsumArcColors(
    entityArcs.map((arc) => arc.color),
    { saturation: 100, lightness: 50 }
  );
  const hoveredArcsIpsumColor = multiplyIpsumArcColors(
    hoveredArcs.map((arc) => arc.color),
    { saturation: 100, lightness: 50 }
  );
  const selectedArcsIpsumColor = multiplyIpsumArcColors(
    selectedArcs.map((arc) => arc.color),
    { saturation: 100, lightness: 50 }
  );

  let appliedIpsumColor = new IpsumColor("hsl", [0, 0, 0]);
  if (isHovered) {
    appliedIpsumColor = hoveredArcsIpsumColor;
  } else {
    if (someArcsSelected) {
      appliedIpsumColor = selectedArcsIpsumColor;
    } else {
      appliedIpsumColor = allArcsIpsumColor;
    }
  }

  const backgroundColor = entityArcs
    ? appliedIpsumColor.setAlpha(isHighlighted ? 0.2 : 0.05).toRgbaCSS()
    : `rgba(0, 0, 0, ${isHighlighted ? 0.2 : 0.05})`;

  const boxShadow = entityArcs.reduce((acc, cur, i): string => {
    const ipsumColor = new IpsumArcColor(cur.color)
      .toIpsumColor({
        saturation: 100,
        lightness: 50,
      })
      .setAlpha(isHighlighted ? 0.4 : 0.25);
    return `${acc} 0 ${(i + 1) * 2}px 0 0 ${ipsumColor.toRgbaCSS()}
      ${i === entityArcs.length - 1 ? "" : ","}`;
  }, "");

  const cursor = ctrlKey ? "pointer" : undefined;

  const ref = useRef<HTMLSpanElement>(null);
  const disambiguatorOpen = !!(multipleArcsSelected && arcIds.length > 1);

  return (
    <>
      <span
        ref={ref}
        aria-details={entityArcs.map((arc) => `${arc.name}`).join(" ")}
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
      {ref?.current && (
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
      )}
    </>
  );
};
