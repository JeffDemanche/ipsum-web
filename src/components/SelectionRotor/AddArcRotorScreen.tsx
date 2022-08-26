import { Add } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { Button } from "components/Button/Button";
import React from "react";

export const AddArcRotorScreen: React.FC = () => {
  return (
    <div>
      <TextField placeholder="New arc name...">dsf</TextField>
      <div>Arc searcher component</div>
      <Button>
        <Add></Add>
      </Button>
    </div>
  );
};
