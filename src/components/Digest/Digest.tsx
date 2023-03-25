import { HighlightTag } from "components/HighlightTag";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import React, { useCallback, useContext, useMemo } from "react";
import { useApiAction } from "state/api";
import styles from "./Digest.less";
import { useStateDocumentQuery } from "state/in-memory";
import { DiptychContext } from "components/DiptychContext";

interface DigestProps {
  entryKey: string;
}

export const Digest: React.FunctionComponent<DigestProps> = ({ entryKey }) => {
  const { data: highlights } = useStateDocumentQuery({
    collection: "highlight",
  });
  const {
    selectedHighlightIds,
    setSelectedHighlightIds,
    hoveredHighlightIds,
    setHoveredHighlightIds,
  } = useContext(HighlightSelectionContext);

  const { setFirstLayer } = useContext(DiptychContext);

  const arcAssignmentValues = Object.values(highlights);
  const assignments = useMemo(() => {
    return arcAssignmentValues.filter(
      (assignment) => assignment.entryKey === entryKey
    );
  }, [arcAssignmentValues, entryKey]);

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

  const { act: unassignArc } = useApiAction({ name: "unassignArc" });

  const entryDigests = useMemo(() => {
    return (
      <div className={styles["digest-for-entry"]}>
        {assignments.map((assgn, i) => {
          return (
            <React.Fragment key={i}>
              <HighlightTag
                className={styles["digest-token"]}
                highlightId={assgn.id}
                highlighted={tokenHighlighted(assgn.id)}
                onMouseEnter={() => {
                  setHoveredHighlightIds([assgn.id]);
                }}
                onMouseLeave={() => {
                  setHoveredHighlightIds(undefined);
                }}
                onClick={() => {
                  setSelectedHighlightIds([assgn.id]);
                }}
              ></HighlightTag>
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [
    assignments,
    setHoveredHighlightIds,
    setSelectedHighlightIds,
    tokenHighlighted,
  ]);

  return <div className={styles["digest"]}>{entryDigests}</div>;
};
