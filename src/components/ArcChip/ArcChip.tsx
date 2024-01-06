import React from "react";
import { Chip } from "@mui/material";

export interface ArcChipProps {
  label: string;
  hue: number;

  onClick?: () => void;
  onDelete?: () => void;
}

export const ArcChip: React.FC<ArcChipProps> = ({
  label,
  hue,
  onClick,
  onDelete,
}) => {
  return (
    <Chip
      variant="outlined"
      label={label}
      sx={{
        backgroundColor: `hsla(${hue}, 73%, 84%, 1)`,
        ":hover": { backgroundColor: `hsla(${hue}, 50%, 84%, 1) !important` },
      }}
      onClick={onClick}
      onDelete={onDelete}
    />
  );
};
