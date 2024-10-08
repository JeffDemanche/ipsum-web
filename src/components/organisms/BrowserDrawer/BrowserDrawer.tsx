import { Drawer } from "components/atoms/Drawer";
import React, { FunctionComponent, useMemo } from "react";
import { HighlightsBrowserTab } from "util/state";

import { BrowserHighlightsTab } from "../BrowserHighlightsTab";
import styles from "./BrowserDrawer.less";

interface BrowserDrawerProps {
  drawerStyle?: React.CSSProperties;
  drawerClassName?: string;

  closedContentStyle?: React.CSSProperties;
  closedContentClassName?: string;

  defaultOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

  tab: HighlightsBrowserTab["type"];
  highlightsTabProps?: React.ComponentProps<typeof BrowserHighlightsTab>;
}

export const BrowserDrawer: FunctionComponent<BrowserDrawerProps> = ({
  drawerStyle,
  drawerClassName,
  closedContentStyle,
  closedContentClassName,
  defaultOpen,
  onOpen,
  onClose,
  tab,
  highlightsTabProps,
}) => {
  const openedContent = useMemo(() => {
    switch (tab) {
      case "highlights":
        return (
          <div style={closedContentStyle} className={closedContentClassName}>
            <BrowserHighlightsTab {...highlightsTabProps} />
          </div>
        );
      default:
        return null;
    }
  }, [closedContentClassName, closedContentStyle, highlightsTabProps, tab]);

  return (
    <Drawer
      style={drawerStyle}
      className={drawerClassName}
      direction="left"
      defaultOpen={defaultOpen}
      onOpen={onOpen}
      onClose={onClose}
      openedContent={openedContent}
      openedContentClassName={styles["opened-content"]}
    />
  );
};
