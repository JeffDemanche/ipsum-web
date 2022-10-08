import { ArcToken } from "components/Arc/ArcToken";
import { ArcSelectionContext } from "components/ArcSelection/ArcSelectionContext";
import React, { useContext, useMemo } from "react";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import styles from "./Digest.less";

interface DigestProps {
  entryKey: string;
}

export const Digest: React.FunctionComponent<DigestProps> = ({ entryKey }) => {
  const {
    state: { arcAssignments },
  } = useContext(InMemoryStateContext);
  const { selectedArcIds, setHoveredArcIds, setSelectedArcIds } =
    useContext(ArcSelectionContext);

  const assignments = useMemo(() => {
    return Object.values(arcAssignments).filter(
      (assignment) => assignment.entryKey === entryKey
    );
  }, [arcAssignments, entryKey]);

  const entryDigests = useMemo(() => {
    return (
      <div className={styles["digest-for-entry"]}>
        {assignments.map((assgn, i) => (
          <ArcToken
            key={i}
            arcId={assgn.arcId}
            selected={selectedArcIds?.includes(assgn.arcId)}
            onMouseEnter={() => {
              setHoveredArcIds([assgn.arcId]);
            }}
            onMouseLeave={() => {
              setHoveredArcIds([]);
            }}
            onClick={() => {
              setSelectedArcIds([assgn.arcId]);
            }}
          ></ArcToken>
        ))}
      </div>
    );
  }, [assignments, selectedArcIds, setHoveredArcIds, setSelectedArcIds]);

  return <div className={styles["digest"]}>{entryDigests}</div>;
};
