import { BookmarkRemoveOutlined, OpenInNewOutlined } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { ArcToken } from "components/Arc";
import { ArcSelectionContext } from "components/SelectionContext";
import React, { useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useApiAction } from "state/api";
import styles from "./Digest.less";
import { useStateDocumentQuery } from "state/in-memory";
import { DiptychContext } from "components/DiptychContext";

interface DigestProps {
  entryKey: string;
}

export const Digest: React.FunctionComponent<DigestProps> = ({ entryKey }) => {
  const { data: arcAssignments } = useStateDocumentQuery({
    collection: "arc_assignment",
  });
  const { selectedArcIds, hoveredArcIds, setHoveredArcIds, setSelectedArcIds } =
    useContext(ArcSelectionContext);

  const { setFirstLayer } = useContext(DiptychContext);

  const arcAssignmentValues = Object.values(arcAssignments);
  const assignments = useMemo(() => {
    return arcAssignmentValues.filter(
      (assignment) => assignment.entryKey === entryKey
    );
  }, [arcAssignmentValues, entryKey]);

  const tokenSelected = useCallback(
    (arcId: string) => selectedArcIds?.includes(arcId),
    [selectedArcIds]
  );

  const tokenHighlighted = useCallback(
    (arcId: string) =>
      selectedArcIds?.includes(arcId) || hoveredArcIds?.includes(arcId),
    [hoveredArcIds, selectedArcIds]
  );

  const { act: unassignArc } = useApiAction({ name: "unassignArc" });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const entryDigests = useMemo(() => {
    return (
      <div className={styles["digest-for-entry"]}>
        {assignments.map((assgn, i) => {
          return (
            <React.Fragment key={i}>
              <ArcToken
                className={styles["digest-token"]}
                arcForToken={{ type: "from id", id: assgn.arcId }}
                highlighted={tokenHighlighted(assgn.arcId)}
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
              {tokenSelected(assgn.arcId) && (
                <div className={styles["selected-arc-functions"]}>
                  <Button
                    variant="outlined"
                    size="small"
                    className={styles["function-button"]}
                    onClick={() => {
                      unassignArc({
                        arcId: assgn.arcId,
                        entryKey: assgn.entryKey,
                      });
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete("arcs");
                      navigate(
                        { search: newParams.toString() },
                        { replace: false }
                      );
                    }}
                  >
                    <Tooltip title="Unassign arc from entry">
                      <BookmarkRemoveOutlined fontSize="small"></BookmarkRemoveOutlined>
                    </Tooltip>
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ width: "40px" }}
                    className={styles["function-button"]}
                    onClick={() => {
                      setFirstLayer({
                        type: "arc_detail",
                        connectionId: assgn.id,
                        objectId: assgn.arcId,
                      });
                    }}
                  >
                    <Tooltip title="Open arc details">
                      <OpenInNewOutlined fontSize="small"></OpenInNewOutlined>
                    </Tooltip>
                  </Button>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [
    assignments,
    navigate,
    searchParams,
    setHoveredArcIds,
    setSelectedArcIds,
    tokenHighlighted,
    tokenSelected,
    unassignArc,
  ]);

  return <div className={styles["digest"]}>{entryDigests}</div>;
};
