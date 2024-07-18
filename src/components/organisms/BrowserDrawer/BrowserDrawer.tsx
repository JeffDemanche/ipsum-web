import { Drawer } from "components/atoms/Drawer";
import React, { FunctionComponent } from "react";

import { BrowserHighlightsTab } from "../BrowserHighlightsTab";

interface BrowserDrawerProps {
  highlightsTabProps?: React.ComponentProps<typeof BrowserHighlightsTab>;
}

export const BrowserDrawer: FunctionComponent<BrowserDrawerProps> = ({
  highlightsTabProps,
}) => {
  const openedContent = <BrowserHighlightsTab {...highlightsTabProps} />;

  return <Drawer openedContent={openedContent} />;
};
