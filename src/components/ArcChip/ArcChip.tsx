import React from "react";
import { Chip } from "@mui/material";

export interface ArcChipProps {
  label: string;
  hue: number;

  onClick?: () => void;
  onDelete?: () => void;

  chipProps?: Partial<React.ComponentProps<typeof Chip>>;
}

export const ArcChip: React.FC<ArcChipProps> = ({
  label,
  hue,
  onClick,
  onDelete,
  chipProps,
}) => {
  return (
    <Chip
      {...chipProps}
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
