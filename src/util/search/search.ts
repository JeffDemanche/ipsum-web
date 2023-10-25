import { useQuery } from "@apollo/client";
import { DiptychContext } from "components/DiptychContext";
import { useContext, useMemo } from "react";
import { gql } from "util/apollo";
import { compareDatesDesc, IpsumDateTime, IpsumDay } from "util/dates";
import { URLSearchCriteria, useIpsumSearchParams } from "util/url";

interface UseHighlightSearchResultsResult {
  searchResults: { id: string }[];
}

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

  const { topLayer } = useContext(DiptychContext);

  /**
   * Fills in cases when the search results are not present in the URL, they are
   * inferred based on the layer structure and/or selected highlights.
   */
  const searchCriteria: URLSearchCriteria = useMemo(() => {
    if (searchCriteriaFromUrl) return searchCriteriaFromUrl;

    if (topLayer?.highlightFrom) {
      return {
        and: [
          {
            or: [
              {
                relatesToHighlight: {
                  highlightId: topLayer.highlightFrom,
                },
              },
            ],
          },
        ],
      };
    } else if (
      topLayer?.type === "daily_journal" &&
      (topLayer.focusedDate || topLayer.visibleDates)
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
    } else if (topLayer?.type === "arc_detail") {
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
  }, [searchCriteriaFromUrl, topLayer]);

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
    searchResults: sortedResults,
  };
};