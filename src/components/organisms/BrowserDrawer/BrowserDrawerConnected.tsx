import { useQuery } from "@apollo/client";
import { RelationsTable } from "components/molecules/RelationsTable";
import React, { useMemo } from "react";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { SortType } from "util/sort";
import { useIpsumSearchParams, useModifySearchParams } from "util/state";

import { BrowserDrawer } from "./BrowserDrawer";

interface BrowserDrawerConnectedProps {
  style?: React.CSSProperties;
  className?: string;
}

const BrowserDrawerQuery = gql(`
  query BrowserDrawer($filterArcIds: [ID!]!) {
    arcs(ids: $filterArcIds) {
      id
      name
      color
    }
  }
`);

export const BrowserDrawerConnected: React.FunctionComponent<
  BrowserDrawerConnectedProps
> = ({ style, className }) => {
  const { browser: browserUrlParams } = useIpsumSearchParams<"journal">();

  const modifySearchParams = useModifySearchParams<"journal">();

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

  const dateFilterFrom = IpsumDay.fromString(
    browserUrlParams?.tab?.filters?.dateFrom,
    "url-format"
  );
  const dateFilterTo = IpsumDay.fromString(
    browserUrlParams?.tab?.filters?.dateTo,
    "url-format"
  );

  const sortDay = IpsumDay.fromString(
    browserUrlParams?.tab?.sort?.day,
    "url-format"
  );
  const sortType: SortType = browserUrlParams?.tab?.sort?.type ?? "Importance";

  const onOpen = () => {
    modifySearchParams((params) => {
      params.browser = {
        ...params.browser,
        open: true,
      };
      return params;
    });
  };

  const onClose = () => {
    modifySearchParams((params) => {
      params.browser = {
        ...params.browser,
        open: false,
      };
      return params;
    });
  };

  const onHighlightsOpensDrawerOpen = () => {
    modifySearchParams((params) => {
      params.browser = {
        ...params.browser,
        tab: {
          ...params.browser?.tab,
          optionsOpen: true,
        },
      };
      return params;
    });
  };

  const onHighlightsOptionsDrawerClose = () => {
    modifySearchParams((params) => {
      params.browser = {
        ...params.browser,
        tab: {
          ...params.browser?.tab,
          optionsOpen: false,
        },
      };
      return params;
    });
  };

  return (
    <BrowserDrawer
      style={style}
      className={className}
      defaultOpen={browserUrlParams?.open ?? true}
      onOpen={onOpen}
      onClose={onClose}
      tab={browserUrlParams?.tab?.type ?? "highlights"}
      highlightsTabProps={{
        highlights: [],
        optionsDrawerProps: {
          defaultExpanded: browserUrlParams?.tab?.optionsOpen ?? false,
          onExpand: onHighlightsOpensDrawerOpen,
          onCollapse: onHighlightsOptionsDrawerClose,
          filterOptionsProps: {
            clauses,
            dateFilterFrom,
            dateFilterTo,
            onCreateClause: () => {},
          },
          sortDay,
          sortType,
          onSortTypeChange: () => {},
          onSortDayChange: () => {},
        },
      }}
    />
  );
};
