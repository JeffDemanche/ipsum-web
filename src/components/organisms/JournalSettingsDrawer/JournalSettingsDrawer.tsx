import { Button } from "components/atoms/Button";
import { Drawer } from "components/atoms/Drawer";
import { PersistentTextField } from "components/atoms/PersistentTextField";
import React, { FunctionComponent } from "react";

import styles from "./JournalSettingsDrawer.less";

interface JournalSettingsDrawerProps {
  journalTitle: string;
  onJournalTitleChange: (value: string) => void;
  defaultOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

  drawerClassname?: string;

  onNewClick: () => void;
  onSaveClick: () => void;
  onLoadClick: () => void;
}

export const JournalSettingsDrawer: FunctionComponent<
  JournalSettingsDrawerProps
> = ({
  journalTitle,
  onJournalTitleChange,
  defaultOpen,
  onOpen,
  onClose,
  drawerClassname,
  onNewClick,
  onSaveClick,
  onLoadClick,
}) => {
  const openedContent = (
    <div className={styles["journal-settings"]}>
      <PersistentTextField
        defaultValue={journalTitle}
        onChange={onJournalTitleChange}
      />
      <div className={styles["file-options-buttons"]}>
        <Button onClick={onNewClick} variant="contained">
          New
        </Button>
        <Button onClick={onSaveClick} variant="contained">
          Save
        </Button>
        <Button onClick={onLoadClick} variant="contained">
          Load
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer
      className={drawerClassname}
      openedContentClassName={styles["drawer-opened-content"]}
      direction="right"
      openedContent={openedContent}
      defaultOpen={defaultOpen}
      onOpen={onOpen}
      onClose={onClose}
      showWrappingBorder
    />
  );
};
