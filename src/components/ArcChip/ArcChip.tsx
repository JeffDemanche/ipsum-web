import React from "react";
import { Chip } from "@mui/material";

export interface ArcChipProps {
  transparent?: boolean;

  label: string;
  hue: number;

  onClick?: (e: React.MouseEvent) => void;
  onDelete?: () => void;

  chipProps?: Partial<React.ComponentProps<typeof Chip>>;
}

export const ArcChip: React.FC<ArcChipProps> = ({
  transparent,
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
        opacity: transparent ? 0.7 : 1,
        backgroundColor: `hsla(${hue}, 50%, 30%, 1)`,
        color: `hsla(${hue}, 50%, 80%, 1)`,
        ":hover": {
          backgroundColor: `hsla(${hue}, 50%, 50%, 1) !important`,
          color: `hsla(${hue}, 50%, 90%, 1) !important`,
        },
      }}
      onClick={onClick}
      onDelete={onDelete}
    />
  );
};
