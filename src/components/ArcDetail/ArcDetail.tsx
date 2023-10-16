import { Paper } from "@mui/material";
import { ArcDetailOntologySection } from "components/ArcDetailOntologySection";
import { ArcDetailPrefsBox } from "components/ArcDetailPrefsBox";
import { ArcDetailWikiSection } from "components/ArcDetailWikiSection";
import { LayerContext } from "components/Diptych";
import { LayerHeader } from "components/LayerHeader";
import React, { useContext } from "react";
import styles from "./ArcDetail.less";
import { ArcDetailProvider } from "./ArcDetailContext";

export const ArcDetail: React.FunctionComponent = () => {
  const { layer } = useContext(LayerContext);
  if (layer.type !== "arc_detail") {
    throw new Error("ArcDetail component used outside of arc_detail layer");
  }

  return (
    <ArcDetailProvider arcId={layer.arcId}>
      <Paper className={styles["arc-detail"]} variant="shadowed">
        <LayerHeader />
        <ArcDetailPrefsBox></ArcDetailPrefsBox>
        <ArcDetailOntologySection></ArcDetailOntologySection>
        <ArcDetailWikiSection></ArcDetailWikiSection>
      </Paper>
    </ArcDetailProvider>
  );
};
