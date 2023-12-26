import {
  ArrowLeftRounded,
  Delete,
  ThreeSixty,
  Comment,
} from "@mui/icons-material";
import { Button, IconButton, Popover, Tooltip } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import React, { useCallback, useContext, useRef, useState } from "react";
import { deleteHighlight } from "util/apollo";
import { HighlightAddReflectionForm } from "./HighlightAddReflectionForm";
import styles from "./HighlightBox.less";

interface HighlightBoxButtonsProps {
  highlightId: string;
}

export const HighlightBoxButtons: React.FunctionComponent<
  HighlightBoxButtonsProps
> = ({ highlightId }) => {
  const { popHighlights } = useContext(DiptychContext);

  const onDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteHighlight(highlightId);
    },
    [highlightId]
  );

  const [reflectionPopoverOpen, setReflectionPopoverOpen] = useState(false);

  const reflectionButtonRef = useRef<HTMLButtonElement>(null);

  const onReflectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setReflectionPopoverOpen((open) => !open);
  }, []);

  return (
    <div className={styles["details-options"]}>
      <Tooltip
        title="Deselect highlight"
        onClick={(e) => {
          // TODO make this smarter once the highlights have been fleshed
          // out.
          e.stopPropagation();
          popHighlights();
        }}
      >
        <IconButton size="small" color="default">
          <ArrowLeftRounded />
        </IconButton>
      </Tooltip>
      <div className={styles["options-buttons"]}>
        <Popover
          open={reflectionPopoverOpen}
          anchorEl={reflectionButtonRef.current}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          onClose={() => setReflectionPopoverOpen(false)}
        >
          <HighlightAddReflectionForm
            highlightId={highlightId}
          ></HighlightAddReflectionForm>
        </Popover>
        <Tooltip title="Reflections">
          <Button
            size="small"
            startIcon={<ThreeSixty />}
            onClick={onReflectionClick}
            ref={reflectionButtonRef}
          >
            Reflect
          </Button>
        </Tooltip>
        <Tooltip title="Comment">
          <Button size="small" startIcon={<Comment />}>
            Comment (0)
          </Button>
        </Tooltip>
        <Tooltip className={styles["delete-button"]} title="Delete highlight">
          <Button size="small" startIcon={<Delete />} onClick={onDeleteClick}>
            Delete
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
