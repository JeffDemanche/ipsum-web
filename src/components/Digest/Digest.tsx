import { BookmarkRemoveOutlined, OpenInNewOutlined } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { HighlightTag } from "components/HighlightTag";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
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
  const {
    selectedHighlightIds,
    setSelectedHighlightIds,
    hoveredHighlightIds,
    setHoveredHighlightIds,
  } = useContext(HighlightSelectionContext);

  const { setFirstLayer } = useContext(DiptychContext);

  const arcAssignmentValues = Object.values(arcAssignments);
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

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
                  setFirstLayer({
                    type: "arc_detail",
                    connectionId: assgn.id,
                  });
                }}
              ></HighlightTag>
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
    setFirstLayer,
    setHoveredHighlightIds,
    setSelectedHighlightIds,
    tokenHighlighted,
    tokenSelected,
    unassignArc,
  ]);

  return <div className={styles["digest"]}>{entryDigests}</div>;
};
