import { Button } from "components/atoms/Button";
import { ToggleButton } from "components/atoms/ToggleButton";
import React, { useState } from "react";

import styles from "./LexicalFilterSelector.less";

interface LexicalFilterSelectorProps {
  editMode: boolean;
}

export const LexicalFilterSelector: React.FunctionComponent<
  LexicalFilterSelectorProps
> = ({ editMode }) => {
  const [rawMode, setRawMode] = useState(false);

  return (
    <div className={styles["lexical-filter-selector"]}>
      <ToggleButton
        value="check"
        onClick={(e) => {
          setRawMode(!rawMode);
        }}
      >
        Raw
      </ToggleButton>
    </div>
  );
};
