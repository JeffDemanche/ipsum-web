import { MenuItem, TextField } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import { HighlightSearchCriteriaPanel } from "components/HighlightSearchCriteriaPanel";
import { HighlightsList } from "components/HighlightsList";
import React, { useContext, useMemo } from "react";
import { useHighlightSearch } from "util/search";

import styles from "./MedianSearchSection.less";

export const MedianSearchSection: React.FunctionComponent = () => {
  const { isUserSearch, searchCriteria, searchResults } = useHighlightSearch();

  const { selectedHighlightId, sort, setSort } = useContext(DiptychContext);

  const highlightIds = useMemo(() => {
    const results = searchResults?.map((highlight) => highlight.id) ?? [];
    if (!results.includes(selectedHighlightId)) {
      results.unshift(selectedHighlightId);
    }
    return results;
  }, [searchResults, selectedHighlightId]);

  return (
    <>
      <div className={styles["sort-by-select-container"]}>
        <TextField
          size="small"
          SelectProps={{
            style: { height: "32px" },
          }}
          variant="outlined"
          label="Sort by"
          value={sort}
          select
          multiline
          onChange={(e) => {
            setSort(e.target.value as "importance" | "date");
          }}
        >
          <MenuItem value="importance">Importance</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </TextField>
      </div>
      <HighlightSearchCriteriaPanel
        isUserSearch={isUserSearch}
        searchCriteria={searchCriteria}
      />
      <div className={styles["results"]}>
        <HighlightsList highlightIds={highlightIds} />
      </div>
    </>
  );
};
