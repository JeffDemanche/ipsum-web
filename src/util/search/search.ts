import { useQuery } from "@apollo/client";
import { DiptychContext } from "components/DiptychContext";
import { useContext, useMemo } from "react";
import { gql } from "util/apollo";
import { compareDatesDesc, IpsumDateTime, IpsumDay } from "util/dates";
import { URLSearchCriteria, useIpsumSearchParams } from "util/url";

interface UseHighlightSearchResultsResult {
  isUserSearch: boolean;
  searchCriteria: URLSearchCriteria;
  searchResults: { id: string; entry: { date: string } }[];
}

const UseHighlightSearchHighlightArcsQuery = gql(`
  query UseHighlightSearchHighlightArcs($highlightId: ID!) {
    highlight(id: $highlightId) {
      outgoingRelations {
        id
        object {
          ... on Arc {
            id
          }
        }
      }
    }
  }
`);

export const UseHighlightSearchQuery = gql(`
  query UseHighlightSearch($searchCriteria: SearchCriteria!) {
    searchHighlights(criteria: $searchCriteria) {
      id
      entry {
        entryKey
        date
      }
    }
  }
`);

export const useSearchResults = (): UseHighlightSearchResultsResult => {
  const searchCriteriaFromUrl =
    useIpsumSearchParams<"journal">().searchCriteria;

  const { topLayer, selectedHighlightId } = useContext(DiptychContext);

  const { data: highlightArcsData } = useQuery(
    UseHighlightSearchHighlightArcsQuery,
    {
      skip: !selectedHighlightId,
      variables: { highlightId: selectedHighlightId },
    }
  );
  const topLayerHighlightArcs = useMemo(
    () =>
      highlightArcsData?.highlight.outgoingRelations.map(
        (relation) => relation.object.id
      ),
    [highlightArcsData?.highlight.outgoingRelations]
  );

  const isUserSearch = !!searchCriteriaFromUrl;

  /**
   * Fills in cases when the search results are not present in the URL, they are
   * inferred based on the layer structure and/or selected highlights.
   */
  const searchCriteria: URLSearchCriteria = useMemo(() => {
    if (isUserSearch) return searchCriteriaFromUrl;

    // If highlight is selected
    if (selectedHighlightId) {
      return {
        and: [
          {
            or: topLayerHighlightArcs.map((arcId) => ({
              relatesToArc: {
                arcId,
              },
            })),
          },
        ],
      };
    }
    // If no highlight is selected and user is browsing daily journal.
    else if (
      topLayer?.type === "daily_journal" &&
      ((topLayer.focusedDate &&
        topLayer.focusedDate !== IpsumDay.today().toString("url-format")) ||
        topLayer.visibleDates)
    ) {
      const dates = topLayer.focusedDate
        ? [IpsumDay.fromString(topLayer.focusedDate, "url-format")]
        : topLayer.visibleDates
            .map((date) => IpsumDay.fromString(date, "url-format"))
            .sort((a, b) =>
              compareDatesDesc(a.toIpsumDateTime(), b.toIpsumDateTime())
            );
      return {
        and: [
          {
            or: [
              {
                days: {
                  days: dates.map((date) => date.toString("url-format")),
                },
              },
            ],
          },
        ],
      };
    }
    // If on arc detail page.
    else if (topLayer?.type === "arc_detail") {
      return {
        and: [
          {
            or: [
              {
                relatesToArc: {
                  arcId: topLayer.arcId,
                },
              },
            ],
          },
        ],
      };
    }

    return {};
  }, [
    isUserSearch,
    searchCriteriaFromUrl,
    selectedHighlightId,
    topLayer,
    topLayerHighlightArcs,
  ]);

  const { data } = useQuery(UseHighlightSearchQuery, {
    variables: { searchCriteria },
  });

  const allHighlights = data?.searchHighlights;
  const sortedResults =
    allHighlights &&
    Object.values([...allHighlights]).sort((a, b) =>
      compareDatesDesc(
        IpsumDateTime.fromString(a.entry.entryKey, "entry-printed-date"),
        IpsumDateTime.fromString(b.entry.entryKey, "entry-printed-date")
      )
    );

  return {
    isUserSearch,
    searchCriteria,
    searchResults: sortedResults,
  };
};
