import { Close } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { ArcDetailOntologySection } from "components/ArcDetailOntologySection";
import { ArcDetailPrefsBox } from "components/ArcDetailPrefsBox";
import { ArcDetailWikiSection } from "components/ArcDetailWikiSection";
import { LayerContext } from "components/Diptych";
import React, { useContext } from "react";
import styles from "./ArcDetail.less";
import { ArcDetailProvider } from "./ArcDetailContext";

export const ArcDetail: React.FunctionComponent = () => {
  const { layer, previousLayer } = useContext(LayerContext);
  if (layer.type !== "arc_detail") {
    throw new Error("ArcDetail component used outside of arc_detail layer");
  }

  return (
    <ArcDetailProvider
      arcId={layer.arcId}
      incomingHighlightId={
        previousLayer?.highlightTo ?? previousLayer?.highlightFrom
      }
    >
      <Paper className={styles["arc-detail"]} variant="shadowed">
        <IconButton onClick={() => {}}>
          <Close></Close>
        </IconButton>
        <ArcDetailPrefsBox></ArcDetailPrefsBox>
        <ArcDetailOntologySection></ArcDetailOntologySection>
        <ArcDetailWikiSection></ArcDetailWikiSection>
      </Paper>
    </ArcDetailProvider>
  );
};
