import { HighlightTag } from "components/HighlightTag";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import React, { useCallback, useContext, useMemo } from "react";
import styles from "./Digest.less";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { LayerContext } from "components/Diptych";
import { DiptychContext } from "components/DiptychContext";
import { IpsumDay } from "util/dates";

interface DigestProps {
  entryKey: string;
}

const DigestQuery = gql(`
  query Digest($entryKey: ID!) {
    entry(entryKey: $entryKey) {
      entryKey
      date
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

  const { hoveredHighlightIds, setHoveredHighlightIds } = useContext(
    HighlightSelectionContext
  );

  const { setTopHighlightFrom, selectedHighlightId } =
    useContext(DiptychContext);

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
                  setTopHighlightFrom(highlight.id, data.entry?.entryKey);
                }}
              ></HighlightTag>
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [
    data.entry?.entryKey,
    highlights,
    setHoveredHighlightIds,
    setTopHighlightFrom,
    tokenHighlighted,
  ]);

  return <div className={styles["digest"]}>{entryDigests}</div>;
};
