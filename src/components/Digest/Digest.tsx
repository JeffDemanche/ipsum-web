import { HighlightTag } from "components/HighlightTag";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import React, { useCallback, useContext, useMemo } from "react";
import styles from "./Digest.less";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { LayerContext } from "components/Diptych";

interface DigestProps {
  entryKey: string;
}

const DigestQuery = gql(`
  query Digest($entryKey: ID!) {
    entry(entryKey: $entryKey) {
      entryKey
      highlights {
        id
      }
    }
  }
`);

export const Digest: React.FunctionComponent<DigestProps> = ({ entryKey }) => {
  const { data } = useQuery(DigestQuery, { variables: { entryKey } });
  const { layerIndex } = useContext(LayerContext);

  const highlights = useMemo(
    () => data?.entry?.highlights ?? [],
    [data?.entry?.highlights]
  );

  const {
    selectedHighlightId,
    setSelectedHighlightId,
    hoveredHighlightIds,
    setHoveredHighlightIds,
  } = useContext(HighlightSelectionContext);

  const tokenSelected = useCallback(
    (highlightId: string) => selectedHighlightId === highlightId,
    [selectedHighlightId]
  );

  const tokenHighlighted = useCallback(
    (highlightId: string) =>
      selectedHighlightId === highlightId ||
      hoveredHighlightIds?.includes(highlightId),
    [hoveredHighlightIds, selectedHighlightId]
  );

  const entryDigests = useMemo(() => {
    return (
      <div className={styles["digest-for-entry"]}>
        {highlights.map((highlight, i) => {
          return (
            <React.Fragment key={i}>
              <HighlightTag
                className={styles["digest-token"]}
                highlightId={highlight.id}
                highlighted={tokenHighlighted(highlight.id)}
                onMouseEnter={() => {
                  setHoveredHighlightIds([highlight.id]);
                }}
                onMouseLeave={() => {
                  setHoveredHighlightIds(undefined);
                }}
                onClick={() => {
                  console.log(highlight.id);
                  setSelectedHighlightId(highlight.id, layerIndex, entryKey);
                }}
              ></HighlightTag>
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [
    entryKey,
    highlights,
    layerIndex,
    setHoveredHighlightIds,
    setSelectedHighlightId,
    tokenHighlighted,
  ]);

  return <div className={styles["digest"]}>{entryDigests}</div>;
};
