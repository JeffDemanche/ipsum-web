import { useQuery } from "@apollo/client";
import cx from "classnames";
import { DiptychContext } from "components/DiptychContext";
import { HighlightTag } from "components/HighlightTag";
import { HoveredHighlightsContext } from "components/HoveredHighlightsContext";
import React, { useCallback, useContext, useMemo } from "react";
import { gql } from "util/apollo";

import styles from "./Digest.less";

interface DigestProps {
  entryKey: string;
  className?: string;
}

const DigestQuery = gql(`
  query Digest($entryKey: ID!) {
    entry(entryKey: $entryKey) {
      entryKey
      date
      highlights {
        id
        hue
      }
    }
  }
`);

export const Digest: React.FunctionComponent<DigestProps> = ({
  entryKey,
  className,
}) => {
  const { data } = useQuery(DigestQuery, { variables: { entryKey } });

  const highlights = useMemo(
    () => data?.entry?.highlights ?? [],
    [data?.entry?.highlights]
  );

  const { hoveredHighlightIds, setHoveredHighlightIds } = useContext(
    HoveredHighlightsContext
  );

  const { setSelectedHighlightId, selectedHighlightId } =
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
      <div className={cx(className, styles["digest-for-entry"])}>
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
                  setSelectedHighlightId(highlight.id);
                }}
              ></HighlightTag>
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [
    className,
    highlights,
    setHoveredHighlightIds,
    setSelectedHighlightId,
    tokenHighlighted,
  ]);

  return <div className={styles["digest"]}>{entryDigests}</div>;
};
