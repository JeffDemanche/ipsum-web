import cx from "classnames";
import { Drawer } from "components/atoms/Drawer";
import type { LexicalFilterSelectorConnectedProps } from "components/hooks/use-lexical-filter-selector-connected";
import { LexicalFilterSelector } from "components/molecules/LexicalFilterSelector";
import type { FunctionComponent} from "react";
import React, { useMemo } from "react";
import type { IpsumDay } from "util/dates";
import { IpsumFilteringProgramV1 } from "util/filtering";
import type { HighlightsBrowserTab } from "util/state";
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
  const filterProgram = useMemo(
    () =>
      new IpsumFilteringProgramV1().setProgram(
        lexicalFilterSelectorProps.programText
      ),
    [lexicalFilterSelectorProps.programText]
  );

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
              groupByDay={
                filterProgram.sortType === "recent first" ||
                filterProgram.sortType === "oldest first"
              }
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
    filterProgram.sortType,
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
