import { Close } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { ArcDetailPrefsBox } from "components/ArcDetailPrefsBox";
import { DiptychContext } from "components/DiptychContext";
import React, { useContext } from "react";
import { IpsumColor } from "util/colors";
import styles from "./ArcDetail.less";
import { ArcDetailContext, ArcDetailProvider } from "./ArcDetailContext";

interface ArcDetailProps {
  assignmentId: string;
}

export const ArcDetail: React.FunctionComponent<ArcDetailProps> = ({
  assignmentId,
}) => {
  return (
    <ArcDetailProvider assignmentId={assignmentId}>
      <ArcDetailWithProvider></ArcDetailWithProvider>
    </ArcDetailProvider>
  );
};

const ArcDetailWithProvider = () => {
  const { closeLayer } = useContext(DiptychContext);
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
      <Button
        onClick={() => {
          closeLayer(1);
        }}
      >
        <Close></Close>
      </Button>
      <ArcDetailPrefsBox></ArcDetailPrefsBox>
    </Paper>
  );
};
