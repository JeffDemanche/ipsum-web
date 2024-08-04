import { Drawer } from "components/atoms/Drawer";
import React, { FunctionComponent, useMemo } from "react";
import { HighlightsBrowserTab } from "util/state";

import { BrowserHighlightsTab } from "../BrowserHighlightsTab";
import styles from "./BrowserDrawer.less";

interface BrowserDrawerProps {
  style?: React.CSSProperties;
  className?: string;

  defaultOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

  tab: HighlightsBrowserTab["type"];
  highlightsTabProps?: React.ComponentProps<typeof BrowserHighlightsTab>;
}

export const BrowserDrawer: FunctionComponent<BrowserDrawerProps> = ({
  style,
  className,
  defaultOpen,
  onOpen,
  onClose,
  tab,
  highlightsTabProps,
}) => {
  const openedContent = useMemo(() => {
    switch (tab) {
      case "highlights":
        return <BrowserHighlightsTab {...highlightsTabProps} />;
      default:
        return null;
    }
  }, [highlightsTabProps, tab]);

  return (
    <Drawer
      style={style}
      className={className}
      direction="left"
      defaultOpen={defaultOpen}
      onOpen={onOpen}
      onClose={onClose}
      openedContent={openedContent}
      openedContentClassName={styles["opened-content"]}
    />
  );
};
