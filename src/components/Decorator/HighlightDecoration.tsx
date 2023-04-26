import React, { useContext, useMemo, useRef } from "react";
import styles from "./HighlightDecoration.less";
import { ContentState } from "draft-js";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import { isSubset } from "util/set";
import { JournalHotkeysContext } from "components/JournalHotkeys";
import { HighlightDisambiguator } from "components/HighlightDisambiguator";
import { IpsumArcColor, IpsumColor, multiplyIpsumArcColors } from "util/colors";
import { IpsumEntityData } from "util/entities";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";

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

const HighlightDecorationQuery = gql(`
  query HighlightDecoration($highlightIds: [ID!]!, $arcIds: [ID!]!) {
    highlights(ids: $highlightIds) {
      id
      arc {
        id
        color
      }
    }
    arcs(ids: $arcIds) {
      id
      name
      color
    }
  }
`);

/**
 * Gets applied in place of any text that `decorator.ts` has determined to have
 * the "ARC" entity applied to it.
 */
export const HighlightDecoration: React.FC<DecoratorProps> = (props) => {
  const entityData = useMemo(
    () =>
      props.contentState
        .getEntity(props.entityKey)
        .getData() as IpsumEntityData,
    [props.contentState, props.entityKey]
  );

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

  const { data } = useQuery(HighlightDecorationQuery, {
    variables: { arcIds, highlightIds: entityHighlightIds },
  });

  const highlights = useMemo(() => data?.highlights ?? [], [data?.highlights]);
  const arcs = useMemo(() => data?.arcs ?? [], [data?.arcs]);

  const { ctrlKey } = useContext(JournalHotkeysContext);
  const {
    hoveredHighlightIds,
    setHoveredHighlightIds,
    selectedHighlightIds,
    setSelectedHighlightIds,
  } = useContext(HighlightSelectionContext);

  const entityArcs =
    arcIds
      ?.map((id) => arcs.find((arc) => arc.id === id))
      .filter((arc) => !!arc) ?? [];
  const hoveredHighlights = useMemo(
    () =>
      highlights.filter((highlight) =>
        hoveredHighlightIds?.includes(highlight.id)
      ),
    [highlights, hoveredHighlightIds]
  );

  const selectedHighlights = useMemo(
    () =>
      highlights.filter((highlight) =>
        selectedHighlightIds?.includes(highlight.id)
      ),
    [highlights, selectedHighlightIds]
  );

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
      .filter((h) => !!h?.arc?.id)
      .map((highlight) => arcs.find((a) => a.id === highlight.arc.id).color),
    { saturation: 100, lightness: 50 }
  );
  const hoveredArcsIpsumColor = multiplyIpsumArcColors(
    hoveredHighlights
      ?.filter((h) => !!h?.arc?.id)
      .map((highlight) => arcs.find((a) => a.id === highlight.arc.id).color),
    { saturation: 100, lightness: 50 }
  );
  const selectedArcsIpsumColor = multiplyIpsumArcColors(
    selectedHighlights
      ?.filter((h) => !!h?.arc?.id)
      .map((highlight) => arcs.find((a) => a.id === highlight.arc.id).color),
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
