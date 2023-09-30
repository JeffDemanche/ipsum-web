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
}

export const ArcDetail: React.FunctionComponent<ArcDetailProps> = ({
  arcId,
  incomingHighlightId,
}) => {
  return (
    <ArcDetailProvider arcId={arcId} incomingHighlightId={incomingHighlightId}>
      <ArcDetailWithProvider></ArcDetailWithProvider>
    </ArcDetailProvider>
  );
};

const ArcDetailWithProvider: React.FunctionComponent = () => {
  return (
    <Paper className={styles["arc-detail"]} variant="shadowed">
      <IconButton onClick={() => {}}>
        <Close></Close>
      </IconButton>
      <ArcDetailPrefsBox></ArcDetailPrefsBox>
      <ArcDetailOntologySection></ArcDetailOntologySection>
      <ArcDetailWikiSection></ArcDetailWikiSection>
    </Paper>
  );
};
