import { useQuery } from "@apollo/client";
import { Close } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { ArcDetailOntologySection } from "components/ArcDetailOntologySection";
import { ArcDetailPrefsBox } from "components/ArcDetailPrefsBox";
import { ArcDetailWikiSection } from "components/ArcDetailWikiSection";
import React, { useContext } from "react";
import { gql } from "util/apollo";
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

const ArcDetailQuery = gql(`
  query ArcDetail($arcId: ID!) {
    arc(id: $arcId) {
      id
      color
    }
  }
`);

const ArcDetailWithProvider: React.FunctionComponent<
  ArcDetailWithProviderProps
> = ({ closeColumn }) => {
  const { arcId } = useContext(ArcDetailContext);

  const {
    data: { arc },
  } = useQuery(ArcDetailQuery, { variables: { arcId } });

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
      <ArcDetailOntologySection></ArcDetailOntologySection>
      <ArcDetailWikiSection></ArcDetailWikiSection>
    </Paper>
  );
};
