import React, { useContext, useMemo, useRef } from "react";
import styles from "./HighlightDecoration.less";
import { ContentState } from "draft-js";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import { isSubset } from "util/set";
import { JournalHotkeysContext } from "components/JournalHotkeys";
import { HighlightDisambiguator } from "components/HighlightDisambiguator";
import { IpsumArcColor, IpsumColor, multiplyHues } from "util/colors";
import { IpsumEntityData } from "util/entities";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { DiptychContext } from "components/DiptychContext";

// Draft doesn't provide this type, this is inferred from logging the props
// value.
interface DecoratorProps {
  entryKey: string;
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
  query HighlightDecoration($entryKey: ID!, $highlightIds: [ID!]!) {
    entry(entryKey: $entryKey) {
      entryKey
      date
    }
    highlights(ids: $highlightIds) {
      id
      entry {
        entryKey
        date
      }
      arc {
        id
        name
        color
      }
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

  const { data } = useQuery(HighlightDecorationQuery, {
    variables: { entryKey: props.entryKey, highlightIds: entityHighlightIds },
  });

  const highlights = useMemo(() => data?.highlights ?? [], [data?.highlights]);

  const arcs = useMemo(
    () =>
      data?.highlights
        ?.reduce((prev, cur) => [...prev, cur.arc], [])
        .filter(Boolean) ?? [],
    [data?.highlights]
  );

  const { ctrlKey } = useContext(JournalHotkeysContext);
  const {
    hoveredHighlightIds,
    setHoveredHighlightIds,
    ambiguouslySelectedHighlightIds,
    setAmbiguouslySelectedHighlightIds,
  } = useContext(HighlightSelectionContext);

  const { setTopHighlightFrom, selectedHighlightId } =
    useContext(DiptychContext);

  const hoveredHighlights = useMemo(
    () =>
      highlights.filter((highlight) =>
        hoveredHighlightIds?.includes(highlight.id)
      ),
    [highlights, hoveredHighlightIds]
  );

  const selectedHighlight = useMemo(
    () => highlights.find((highlight) => selectedHighlightId === highlight.id),
    [highlights, selectedHighlightId]
  );

  const isHovered = useMemo(
    () =>
      hoveredHighlightIds?.length &&
      isSubset(new Set(hoveredHighlightIds), new Set(entityHighlightIds)),
    [entityHighlightIds, hoveredHighlightIds]
  );

  const multipleHighlightsSelected =
    ambiguouslySelectedHighlightIds &&
    ambiguouslySelectedHighlightIds.length > 1;

  const isHighlighted = isHovered || !!selectedHighlight;

  const allArcsIpsumColor = multiplyHues(
    Object.values(highlights)
      .filter((h) => !!h?.arc?.id)
      .map((highlight) => arcs.find((a) => a.id === highlight.arc.id)?.color),
    { saturation: 100, lightness: 50 }
  );
  const hoveredArcsIpsumColor = multiplyHues(
    hoveredHighlights
      ?.filter((h) => !!h?.arc?.id)
      .map((highlight) => arcs.find((a) => a.id === highlight.arc.id)?.color),
    { saturation: 100, lightness: 50 }
  );
  const selectedArcsIpsumColor = multiplyHues(
    [arcs.find((a) => a.id === selectedHighlight?.arc.id)?.color],
    { saturation: 100, lightness: 50 }
  );

  let appliedIpsumColor = new IpsumColor("hsl", [0, 0, 0]);
  if (isHovered) {
    appliedIpsumColor = hoveredArcsIpsumColor;
  } else {
    if (selectedHighlight) {
      appliedIpsumColor = selectedArcsIpsumColor;
    } else {
      appliedIpsumColor = allArcsIpsumColor;
    }
  }

  const backgroundColor = arcs
    ? appliedIpsumColor.setAlpha(isHighlighted ? 0.2 : 0.05).toRgbaCSS()
    : `rgba(0, 0, 0, ${isHighlighted ? 0.2 : 0.05})`;

  const boxShadow = arcs.reduce((acc, cur, i): string => {
    const ipsumColor = new IpsumArcColor(cur.color)
      .toIpsumColor({
        saturation: 100,
        lightness: 50,
      })
      .setAlpha(isHighlighted ? 0.4 : 0.25);
    return `${acc} 0 ${(i + 1) * 2}px 0 0 ${ipsumColor.toRgbaCSS()}
      ${i === arcs.length - 1 ? "" : ","}`;
  }, "");

  const cursor = ctrlKey ? "pointer" : undefined;

  const ref = useRef<HTMLSpanElement>(null);
  const disambiguatorOpen = !!(multipleHighlightsSelected && arcs.length > 1);

  return (
    <>
      <span
        ref={ref}
        aria-details={arcs.map((arc) => `${arc.name}`).join(" ")}
        onMouseEnter={() => {
          setHoveredHighlightIds(entityHighlightIds);
        }}
        onMouseLeave={() => {
          setHoveredHighlightIds(undefined);
        }}
        onClick={() => {
          if (ctrlKey && entityHighlightIds) {
            setAmbiguouslySelectedHighlightIds(entityHighlightIds);
          }
        }}
        className={styles.highlight}
        style={{ cursor, boxShadow, backgroundColor }}
      >
        {props.children}
      </span>
      {ref?.current && arcs && (
        <HighlightDisambiguator
          highlightIds={entityHighlightIds}
          onHighlightSelected={(highlightId: string) => {
            setTopHighlightFrom(highlightId, props.entryKey);
          }}
          open={disambiguatorOpen}
          anchorEl={ref.current}
          onClickAway={() => {
            setTopHighlightFrom(undefined, undefined);
          }}
        ></HighlightDisambiguator>
      )}
    </>
  );
};
