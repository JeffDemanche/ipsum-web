import { useQuery } from "@apollo/client";
import { RelationsTable } from "components/molecules/RelationsTable";
import React, { useMemo } from "react";
import {
  urlSetBrowserDrawerHighlightsOptions,
  urlSetBrowserDrawerOpen,
  urlSetHighlightsOptionsDrawerOpen,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { SortType } from "util/sort";
import { useIpsumSearchParams } from "util/state";

import { BrowserHighlightsTab } from "../BrowserHighlightsTab";
import { BrowserDrawer } from "./BrowserDrawer";
import styles from "./BrowserDrawer.less";

interface BrowserDrawerConnectedProps {
  style?: React.CSSProperties;
  className?: string;
}

const BrowserDrawerQuery = gql(`
  query BrowserDrawer($filterArcIds: [ID!]!) {
    journalEntryDates(includeEmpty: false)
    arcs(ids: $filterArcIds) {
      id
      name
      color
    }
  }
`);

const BrowserDrawerHighlightsSearchQuery = gql(`
  query BrowserDrawerHighlightsSearch($criteria: SearchCriteria!) {
    searchHighlights(criteria: $criteria) {
      id
      excerpt
      hue
      outgoingRelations {
        id
        predicate
        object {
          ... on Arc {
            id
            name
            color
          }
        }
      }
      number
      objectText
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
  const setHighlightsOptionsDrawerOpen = useUrlAction(
    urlSetHighlightsOptionsDrawerOpen
  );
  const setBrowserDrawerHighlightsOptions = useUrlAction(
    urlSetBrowserDrawerHighlightsOptions
  );

  const filterArcIds = useMemo(() => {
    if (!browserUrlParams?.tab?.filters?.and) return [];

    return browserUrlParams.tab.filters.and.reduce<string[]>(
      (acc, andClause) => {
        andClause.or.forEach((relation) => {
          if (relation.relatesToArc) {
            acc.push(relation.relatesToArc.arcId);
          }
        });
        return acc;
      },
      []
    );
  }, [browserUrlParams]);

  const { data } = useQuery(BrowserDrawerQuery, {
    variables: {
      filterArcIds,
    },
  });

  const { data: highlightsData } = useQuery(
    BrowserDrawerHighlightsSearchQuery,
    {
      variables: {
        criteria: {
          and: browserUrlParams?.tab?.filters?.and ?? [],
        },
      },
    }
  );

  const highlights: React.ComponentProps<
    typeof BrowserHighlightsTab
  >["highlights"] = highlightsData.searchHighlights.map((searchHighlight) => {
    const arcRelations = searchHighlight.outgoingRelations.filter(
      (relation) => relation.object.__typename === "Arc"
    );

    return {
      day: IpsumDay.fromString(searchHighlight.history.dateCreated, "iso"),
      excerptProps: {
        htmlString: searchHighlight.excerpt,
        maxLines: 3,
      },
      highlightProps: {
        highlightId: searchHighlight.id,
        highlightNumber: searchHighlight.number,
        arcNames: arcRelations.map((relation) => relation.object.name),
        hue: searchHighlight.hue,
        objectText: searchHighlight.objectText,
      },
      relationsProps: arcRelations.map((relation) => ({
        predicate: relation.predicate,
        arc: {
          id: relation.object.id,
          hue: relation.object.color,
          name: relation.object.name,
        },
      })),
    };
  });

  const clauses: React.ComponentProps<typeof RelationsTable>["clauses"] =
    useMemo(() => {
      if (!browserUrlParams?.tab?.filters?.and || !data?.arcs) {
        return { and: [] };
      }

      return {
        and: browserUrlParams.tab.filters.and.map((andClause) => ({
          orRelations: andClause.or.map((relation) => {
            if (!relation.relatesToArc) return undefined;

            const arc = data.arcs.find(
              (arc) => arc.id === relation.relatesToArc.arcId
            );

            return {
              predicate: relation.relatesToArc.predicate,
              arc: { id: arc.id, hue: arc.color, name: arc.name },
            };
          }),
        })),
      };
    }, [browserUrlParams, data.arcs]);

  const earliestEntryDay = data?.journalEntryDates.reduce((acc, cur) => {
    if (IpsumDay.fromString(cur, "entry-printed-date").isBefore(acc)) {
      return IpsumDay.fromString(cur, "entry-printed-date");
    } else {
      return acc;
    }
  }, IpsumDay.today());

  const dateFilterFrom = IpsumDay.fromString(
    browserUrlParams?.tab?.filters?.dateFrom ??
      earliestEntryDay.toString("url-format"),
    "url-format"
  );

  const onChangeDateFilterFrom = (date: IpsumDay) => {
    setBrowserDrawerHighlightsOptions({
      filters: { dateFrom: date.toString("url-format") },
    });
  };

  const dateFilterTo = IpsumDay.fromString(
    browserUrlParams?.tab?.filters?.dateTo ??
      IpsumDay.today().toString("url-format"),
    "url-format"
  );

  const onChangeDateFilterTo = (date: IpsumDay) => {
    setBrowserDrawerHighlightsOptions({
      filters: { dateTo: date.toString("url-format") },
    });
  };

  const sortDay = IpsumDay.fromString(
    browserUrlParams?.tab?.sort?.day ?? IpsumDay.today().toString("url-format"),
    "url-format"
  );
  const sortType: SortType = browserUrlParams?.tab?.sort?.type ?? "Importance";

  const onOpen = () => {
    setBrowserDrawerOpen(true);
  };

  const onClose = () => {
    setBrowserDrawerOpen(false);
  };

  const onHighlightsOptionsDrawerOpen = () => {
    setHighlightsOptionsDrawerOpen(true);
  };

  const onHighlightsOptionsDrawerClose = () => {
    setHighlightsOptionsDrawerOpen(false);
  };

  const onSortDayChange = (sortDay: IpsumDay) => {
    setBrowserDrawerHighlightsOptions({
      sort: { day: sortDay.toString("url-format") },
    });
  };

  return (
    <BrowserDrawer
      drawerStyle={style}
      drawerClassName={className}
      closedContentClassName={styles["closed-content"]}
      defaultOpen={browserUrlParams?.open ?? true}
      onOpen={onOpen}
      onClose={onClose}
      tab={browserUrlParams?.tab?.type ?? "highlights"}
      highlightsTabProps={{
        highlights,
        optionsDrawerProps: {
          defaultExpanded: browserUrlParams?.tab?.optionsOpen ?? false,
          onExpand: onHighlightsOptionsDrawerOpen,
          onCollapse: onHighlightsOptionsDrawerClose,
          filterOptionsProps: {
            clauses,
            dateFilterFrom,
            dateFilterTo,
            onChangeDateFilterFrom,
            onChangeDateFilterTo,
            onCreateClause: () => {},
          },
          sortDay,
          sortType,
          onSortTypeChange: () => {},
          onSortDayChange,
        },
      }}
    />
  );
};
