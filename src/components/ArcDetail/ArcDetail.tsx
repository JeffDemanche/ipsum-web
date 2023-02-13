import { Close } from "@mui/icons-material";
import { Button } from "@mui/material";
import { ArcDetailPrefsBox } from "components/ArcDetailPrefsBox/ArcDetailPrefsBox";
import { DiptychContext } from "components/DiptychContext/DiptychContext";
import React, { useContext } from "react";
import styles from "./ArcDetail.less";
import { ArcDetailProvider } from "./ArcDetailContext";

interface ArcDetailProps {
  assignmentId: string;
}

export const ArcDetail: React.FunctionComponent<ArcDetailProps> = ({
  assignmentId,
}) => {
  const { closeLayer } = useContext(DiptychContext);

  return (
    <ArcDetailProvider assignmentId={assignmentId}>
      <div className={styles["arc-detail"]}>
        <Button
          onClick={() => {
            closeLayer(1);
          }}
        >
          <Close></Close>
        </Button>
        <ArcDetailPrefsBox></ArcDetailPrefsBox>
      </div>
    </ArcDetailProvider>
  );
};
