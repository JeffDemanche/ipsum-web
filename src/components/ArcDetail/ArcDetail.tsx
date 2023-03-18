import { Close } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { ArcDetailPrefsBox } from "components/ArcDetailPrefsBox";
import React, { useContext } from "react";
import { IpsumColor } from "util/colors";
import styles from "./ArcDetail.less";
import { ArcDetailContext, ArcDetailProvider } from "./ArcDetailContext";

interface ArcDetailProps {
  arcId: string;
  incomingHighlightId?: string;
  closeColumn: () => void;
}

export const ArcDetail: React.FunctionComponent<ArcDetailProps> = ({
  arcId,
  incomingHighlightId,
  closeColumn,
}) => {
  return (
    <ArcDetailProvider arcId={arcId} incomingHighlightId={incomingHighlightId}>
      <ArcDetailWithProvider closeColumn={closeColumn}></ArcDetailWithProvider>
    </ArcDetailProvider>
  );
};

interface ArcDetailWithProviderProps {
  closeColumn: () => void;
}

const ArcDetailWithProvider: React.FunctionComponent<
  ArcDetailWithProviderProps
> = ({ closeColumn }) => {
  const { arc } = useContext(ArcDetailContext);

  return (
    <Paper
      className={styles["arc-detail"]}
      style={{
        border: `2px solid ${new IpsumColor("hsl", [
          arc.color,
          50,
          50,
        ]).toRgbaCSS()}`,
      }}
    >
      <IconButton
        onClick={() => {
          closeColumn();
        }}
      >
        <Close></Close>
      </IconButton>
      <ArcDetailPrefsBox></ArcDetailPrefsBox>
    </Paper>
  );
};
