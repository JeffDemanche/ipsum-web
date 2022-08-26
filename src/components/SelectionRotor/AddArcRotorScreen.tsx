import styles from "./AddArcRotorScreen.less";
import { Add, HubOutlined, WorkspacesOutlined } from "@mui/icons-material";
import { TextField, Typography } from "@mui/material";
import { Button } from "components/Button/Button";
import React from "react";

export const AddArcRotorScreen: React.FC = () => {
  return (
    <div className={styles["addArcRotorScreen"]}>
      <div className={styles["row"]}>
        <WorkspacesOutlined color="secondary" fontSize="small" />
        <TextField placeholder="New arc name...">dsf</TextField>
      </div>
      <div className={styles["row"]}>
        <HubOutlined color="secondary" fontSize="small" />
        <Typography color="secondary">Arc searcher component</Typography>
        <Button color="secondary">
          <Add></Add>
        </Button>
      </div>
    </div>
  );
};
