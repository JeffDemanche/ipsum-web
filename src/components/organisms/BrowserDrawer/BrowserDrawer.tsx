import { Drawer } from "components/atoms/Drawer";
import React, { FunctionComponent, useMemo } from "react";
import { IpsumDay } from "util/dates";
import { HighlightsBrowserTab } from "util/state";
import { TestIds } from "util/test-ids";

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
  highlightsWithDay: { id: string; day: IpsumDay }[];
  renderHighlight: (highlightId: string) => React.ReactNode;
  optionsDrawerProps: React.ComponentProps<
    typeof BrowserHighlightsTab
  >["optionsDrawerProps"];
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
  highlightsWithDay,
  renderHighlight,
  optionsDrawerProps,
}) => {
  const openedContent = useMemo(() => {
    switch (tab) {
      case "highlights":
        return (
          <div
            data-testid={TestIds.BrowserDrawer.BrowserDrawerOpened}
            style={closedContentStyle}
            className={closedContentClassName}
          >
            <BrowserHighlightsTab
              highlightsWithDay={highlightsWithDay}
              renderHighlight={renderHighlight}
              optionsDrawerProps={optionsDrawerProps}
            />
          </div>
        );
      default:
        return null;
    }
  }, [
    closedContentClassName,
    closedContentStyle,
    highlightsWithDay,
    optionsDrawerProps,
    renderHighlight,
    tab,
  ]);

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
      showWrappingBorder
    />
  );
};
