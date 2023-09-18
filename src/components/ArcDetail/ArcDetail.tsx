import { Close } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { ArcDetailOntologySection } from "components/ArcDetailOntologySection";
import { ArcDetailPrefsBox } from "components/ArcDetailPrefsBox";
import { ArcDetailWikiSection } from "components/ArcDetailWikiSection";
import React from "react";
import styles from "./ArcDetail.less";
import { ArcDetailProvider } from "./ArcDetailContext";

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
  return (
    <Paper className={styles["arc-detail"]} variant="shadowed">
      <IconButton
        onClick={() => {
          closeColumn();
        }}
      >
        <Close></Close>
      </IconButton>
      <ArcDetailPrefsBox></ArcDetailPrefsBox>
      <ArcDetailOntologySection></ArcDetailOntologySection>
      <ArcDetailWikiSection></ArcDetailWikiSection>
    </Paper>
  );
};
