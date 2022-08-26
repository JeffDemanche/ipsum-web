import { ManageSearch, PlaylistAdd } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { Button } from "components/Button/Button";
import React from "react";
import styles from "./HomeRotorScreen.less";
import { RotorScreen } from "./SelectionRotorPopper";

interface HomeRotorScreenProps {
  setCurrentScreen: (screen: RotorScreen) => void;
}

export const HomeRotorScreen: React.FC<HomeRotorScreenProps> = ({
  setCurrentScreen,
}) => {
  return (
    <div className={styles["homeRotor"]}>
      <Button
        className={styles["rotorButton"]}
        tooltip="Add arc"
        color="secondary"
        onClick={() => {
          setCurrentScreen("Add Arc");
        }}
      >
        <PlaylistAdd />
      </Button>
      <Divider orientation="vertical" color="primary"></Divider>
      <Button
        className={styles["rotorButton"]}
        tooltip="Assign arc"
        color="secondary"
        onClick={() => {
          setCurrentScreen("Assign Arc");
        }}
      >
        <ManageSearch />
      </Button>
    </div>
  );
};
