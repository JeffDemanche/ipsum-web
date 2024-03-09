import { ArrowLeftRounded, Delete } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import React, { useCallback, useContext } from "react";
import { deleteHighlight } from "util/apollo";
import styles from "./HighlightBox.less";
import { ImportanceRatingButton } from "./ImportanceRatingButton";

interface HighlightBoxButtonsProps {
  highlightId: string;
}

export const HighlightBoxButtons: React.FunctionComponent<
  HighlightBoxButtonsProps
> = ({ highlightId }) => {
  const { setSelectedHighlightId } = useContext(DiptychContext);

  const onDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteHighlight(highlightId);
    },
    [highlightId]
  );

  return (
    <div className={styles["details-options"]}>
      <div className={styles["left-aligned"]}>
        <Tooltip
          className={styles["deselect-button"]}
          title="Deselect highlight"
          onClick={(e) => {
            // TODO make this smarter once the highlights have been fleshed
            // out.
            e.stopPropagation();
            setSelectedHighlightId();
          }}
        >
          <IconButton size="small" color="default">
            <ArrowLeftRounded />
          </IconButton>
        </Tooltip>
        <ImportanceRatingButton highlightId={highlightId} />
      </div>
      <div className={styles["right-aligned"]}>
        <Tooltip className={styles["delete-button"]} title="Delete highlight">
          <Button size="small" startIcon={<Delete />} onClick={onDeleteClick}>
            Delete
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
