import React, { useContext, useMemo, useRef } from "react";
import styles from "./HighlightDecoration.less";
import { ContentState } from "draft-js";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import { isSubset } from "util/set";
import { JournalHotkeysContext } from "components/JournalHotkeys";
import { HighlightDisambiguator } from "components/HighlightDisambiguator";
import { IpsumArcColor, IpsumColor, multiplyIpsumArcColors } from "util/colors";
import { useStateDocumentQuery } from "state/in-memory";
import { IpsumEntityData } from "util/entities";

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
export const HighlightDecoration: React.FC<DecoratorProps> = (props) => {
  const entityData = props.contentState
    .getEntity(props.entityKey)
    .getData() as IpsumEntityData;

  const entityHighlightIds = useMemo(
    () => entityData.textArcAssignments?.map((a) => a.arcAssignmentId) ?? [],
    [entityData.textArcAssignments]
  );
  const arcIds = useMemo(
    () =>
      entityData.textArcAssignments?.map((a) => a.arcId) ??
      entityData.arcIds ??
      [],
    [entityData.arcIds, entityData.textArcAssignments]
  );

  const { ctrlKey } = useContext(JournalHotkeysContext);
  const {
    hoveredHighlightIds,
    setHoveredHighlightIds,
    selectedHighlightIds,
    setSelectedHighlightIds,
  } = useContext(HighlightSelectionContext);
  const { data: arcs } = useStateDocumentQuery({
    collection: "arc",
    name: "arc decoration",
  });
  const { data: highlights } = useStateDocumentQuery({
    collection: "highlight",
    keys: entityHighlightIds,
  });

  const entityArcs = arcIds?.map((id) => arcs[id]).filter((arc) => !!arc) ?? [];
  const hoveredHighlights =
    hoveredHighlightIds?.map((id) => highlights[id]) ?? [];

  const selectedHighlights =
    selectedHighlightIds
      ?.filter((selectedHighlightId) =>
        entityHighlightIds.includes(selectedHighlightId)
      )
      ?.map((id) => highlights[id]) ?? [];

  const isHovered = useMemo(
    () =>
      hoveredHighlightIds?.length &&
      isSubset(new Set(hoveredHighlightIds), new Set(entityHighlightIds)),
    [entityHighlightIds, hoveredHighlightIds]
  );

  const someHighlightsSelected = !!selectedHighlights?.length;

  const multipleHighlightsSelected =
    selectedHighlights && selectedHighlights.length > 1;

  const isHighlighted = isHovered || someHighlightsSelected;

  const allArcsIpsumColor = multiplyIpsumArcColors(
    Object.values(highlights)
      .filter((h) => !!h?.arcId)
      .map((highlight) => arcs[highlight.arcId].color),
    { saturation: 100, lightness: 50 }
  );
  const hoveredArcsIpsumColor = multiplyIpsumArcColors(
    hoveredHighlights
      ?.filter((h) => !!h?.arcId)
      .map((highlight) => arcs[highlight.arcId].color),
    { saturation: 100, lightness: 50 }
  );
  const selectedArcsIpsumColor = multiplyIpsumArcColors(
    selectedHighlights
      ?.filter((h) => !!h?.arcId)
      .map((highlight) => arcs[highlight.arcId].color),
    { saturation: 100, lightness: 50 }
  );

  let appliedIpsumColor = new IpsumColor("hsl", [0, 0, 0]);
  if (isHovered) {
    appliedIpsumColor = hoveredArcsIpsumColor;
  } else {
    if (someHighlightsSelected) {
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
  const disambiguatorOpen = !!(multipleHighlightsSelected && arcIds.length > 1);

  return (
    <>
      <span
        ref={ref}
        aria-details={entityArcs.map((arc) => `${arc.name}`).join(" ")}
        onMouseEnter={() => {
          setHoveredHighlightIds(entityHighlightIds);
        }}
        onMouseLeave={() => {
          setHoveredHighlightIds(undefined);
        }}
        onClick={() => {
          if (ctrlKey && entityHighlightIds) {
            setSelectedHighlightIds(entityHighlightIds);
          }
        }}
        className={styles.highlight}
        style={{ cursor, boxShadow, backgroundColor }}
      >
        {props.children}
      </span>
      {ref?.current && arcIds && (
        <HighlightDisambiguator
          highlightIds={entityHighlightIds}
          onHighlightSelected={(highlightId: string) => {
            setSelectedHighlightIds([highlightId]);
          }}
          open={disambiguatorOpen}
          anchorEl={ref.current}
          onClickAway={() => {
            setSelectedHighlightIds(undefined);
          }}
        ></HighlightDisambiguator>
      )}
    </>
  );
};
