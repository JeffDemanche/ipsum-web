import cx from "classnames";
import { Drawer } from "components/atoms/Drawer";
import { LexicalFilterSelectorConnectedProps } from "components/hooks/use-lexical-filter-selector-connected";
import { LexicalFilterSelector } from "components/molecules/LexicalFilterSelector";
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

  lexicalFilterSelectorProps: LexicalFilterSelectorConnectedProps;
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
  lexicalFilterSelectorProps,
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
            <div
              className={cx(
                styles["filter-selector-container"],
                lexicalFilterSelectorProps.editMode && styles["edit-mode"]
              )}
            >
              <LexicalFilterSelector {...lexicalFilterSelectorProps} />
            </div>
            <BrowserHighlightsTab
              highlightsWithDay={highlightsWithDay}
              renderHighlight={renderHighlight}
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
    lexicalFilterSelectorProps,
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
