import { useQuery } from "@apollo/client";
import { useLexicalFilterSelectorConnected } from "components/hooks/use-lexical-filter-selector-connected";
import React from "react";
import { urlSetBrowserDrawerOpen, useUrlAction } from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { useIpsumSearchParams } from "util/state";

import { BrowserHighlightBlurbConnected } from "../BrowserHighlightBlurb/BrowserHighlightBlurbConnected";
import { BrowserDrawer } from "./BrowserDrawer";
import styles from "./BrowserDrawer.less";

interface BrowserDrawerConnectedProps {
  style?: React.CSSProperties;
  className?: string;
}

const BrowserDrawerHighlightsSearchQuery = gql(`
  query BrowserDrawerHighlightsSearch($program: String!) {
    searchHighlights(program: $program) {
      id
      history {
        dateCreated
      }
    }
  }
`);

export const BrowserDrawerConnected: React.FunctionComponent<
  BrowserDrawerConnectedProps
> = ({ style, className }) => {
  const { browser: browserUrlParams } = useIpsumSearchParams<"journal">();

  const setBrowserDrawerOpen = useUrlAction(urlSetBrowserDrawerOpen);

  const lexicalFilterSelectorProps = useLexicalFilterSelectorConnected();

  const { data: highlightsData } = useQuery(
    BrowserDrawerHighlightsSearchQuery,
    {
      variables: {
        program: lexicalFilterSelectorProps.programText,
      },
    }
  );

  const onOpen = () => {
    setBrowserDrawerOpen(true);
  };

  const onClose = () => {
    setBrowserDrawerOpen(false);
  };

  return (
    <BrowserDrawer
      drawerStyle={style}
      drawerClassName={className}
      closedContentClassName={styles["closed-content"]}
      defaultOpen={(browserUrlParams?.open ?? "true") === "true"}
      onOpen={onOpen}
      onClose={onClose}
      tab={browserUrlParams?.tab?.type ?? "highlights"}
      highlightsWithDay={highlightsData.searchHighlights.map((highlight) => ({
        id: highlight.id,
        day: IpsumDay.fromString(highlight.history.dateCreated, "iso"),
      }))}
      renderHighlight={(highlightId) => {
        return (
          <BrowserHighlightBlurbConnected
            key={highlightId}
            highlightId={highlightId}
          />
        );
      }}
      lexicalFilterSelectorProps={lexicalFilterSelectorProps}
    />
  );
};
