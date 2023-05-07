import { HighlightTag } from "components/HighlightTag";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import React, { useCallback, useContext, useMemo } from "react";
import styles from "./Digest.less";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";

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

  const highlights = useMemo(
    () => data?.entry?.highlights ?? [],
    [data?.entry?.highlights]
  );

  const {
    selectedHighlightIds,
    setSelectedHighlightIds,
    hoveredHighlightIds,
    setHoveredHighlightIds,
  } = useContext(HighlightSelectionContext);

  const tokenSelected = useCallback(
    (highlightId: string) => selectedHighlightIds?.includes(highlightId),
    [selectedHighlightIds]
  );

  const tokenHighlighted = useCallback(
    (highlightId: string) =>
      selectedHighlightIds?.includes(highlightId) ||
      hoveredHighlightIds?.includes(highlightId),
    [hoveredHighlightIds, selectedHighlightIds]
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
                  setSelectedHighlightIds([highlight.id]);
                }}
              ></HighlightTag>
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [
    highlights,
    setHoveredHighlightIds,
    setSelectedHighlightIds,
    tokenHighlighted,
  ]);

  return <div className={styles["digest"]}>{entryDigests}</div>;
};
