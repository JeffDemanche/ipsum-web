import { useQuery } from "@apollo/client";
import { RelationsTable } from "components/molecules/RelationsTable";
import React, { useMemo } from "react";
import {
  urlInsertLayer,
  urlSetBrowserDrawerHighlightsOptions,
  urlSetBrowserDrawerOpen,
  urlSetHighlightsOptionsDrawerOpen,
  useUrlAction,
} from "util/api";
import { gql, SearchSortType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { highlightImportanceOnDay } from "util/importance";
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
  query BrowserDrawerHighlightsSearch($criteria: SearchCriteria!) @client {
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
      importanceRatings {
        day {
          day
        }
        value
      }
      number
      objectText
      history {
        dateCreated
      }
      object {
        __typename
        ... on Arc {
          id
        }
        ... on Day {
          day
        }
        ... on Comment {
          id
          highlight {
            id
          }
        }
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
  const insertLayer = useUrlAction(urlInsertLayer);

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
          sort: {
            sortDay:
              browserUrlParams?.tab?.sort?.day ??
              IpsumDay.today().toString("url-format"),
            type: SearchSortType.Date,
          },
          // TODO
          and: [],
        },
      },
    }
  );

  const highlights: React.ComponentProps<
    typeof BrowserHighlightsTab
  >["highlights"] = highlightsData.searchHighlights.map((searchHighlight) => {
    const arcRelations = searchHighlight.outgoingRelations.filter(
      (relation) => relation.object && relation.object.__typename === "Arc"
    );

    let highlightObject: React.ComponentProps<
      typeof BrowserHighlightsTab
    >["highlights"][number]["highlightObject"];

    const importance = highlightImportanceOnDay({
      ratings: searchHighlight.importanceRatings.map((rating) => ({
        day: rating.day.day,
        value: rating.value,
      })),
      day: IpsumDay.fromString(browserUrlParams?.tab?.sort?.day, "url-format"),
    });

    if (searchHighlight.object.__typename === "Day") {
      highlightObject = {
        type: "daily_journal",
        entryKey: searchHighlight.object.day,
      };
    } else if (searchHighlight.object.__typename === "Arc") {
      highlightObject = {
        type: "arc",
        arcId: searchHighlight.object.id,
      };
    } else {
      highlightObject = {
        type: "comment",
        commentId: searchHighlight.object.id,
        highlightId: searchHighlight.object.highlight.id,
      };
    }

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
        importanceRating: importance,
      },
      relationsProps: arcRelations.map((relation) => ({
        predicate: relation.predicate,
        arc: {
          id: relation.object.id,
          hue: relation.object.color,
          name: relation.object.name,
        },
      })),
      highlightObject,
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
      defaultOpen={(browserUrlParams?.open ?? "true") === "true"}
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
        onHighlightClick: (highlightId) => {
          insertLayer({
            layer: { type: "highlight_detail", highlightId, expanded: "true" },
          });
        },
        onHighlightArcClick: (arcId) => {
          insertLayer({
            layer: { type: "arc_detail", arcId, expanded: "true" },
          });
        },
        onHighlightDailyJournalClick: (entryKey) => {
          insertLayer({
            layer: {
              type: "daily_journal",
              day: IpsumDay.fromString(entryKey, "entry-printed-date").toString(
                "url-format"
              ),
              expanded: "true",
            },
          });
        },
        onHighlightCommentClick: (commentId, highlightId) => {
          insertLayer({
            layer: { type: "highlight_detail", highlightId, expanded: "true" },
          });
        },
      }}
    />
  );
};
