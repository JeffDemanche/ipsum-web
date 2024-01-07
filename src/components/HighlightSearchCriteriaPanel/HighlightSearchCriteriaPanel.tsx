import React, { useCallback, useMemo } from "react";
import { URLSearchCriteria, useModifySearchParams } from "util/url";
import styles from "./HighlightSearchCriteriaPanel.less";
import { ArcChipConnected } from "components/ArcChip";
import { DayChip } from "components/DayChip";
import { IpsumDay } from "util/dates";
import { IconButton, Chip, Button, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export interface HighlightSearchCriteriaPanelProps {
  searchCriteria: URLSearchCriteria;
  isUserSearch: boolean;
}

export const HighlightSearchCriteriaPanel: React.FC<
  HighlightSearchCriteriaPanelProps
> = ({ searchCriteria, isUserSearch }) => {
  const modifySearchParams = useModifySearchParams<"journal">();

  const pushAndClause = useCallback(() => {
    modifySearchParams((searchParams) => {
      const and = searchParams.searchCriteria?.and ?? [];
      and.push({ or: [] });
      return {
        ...searchParams,
        searchCriteria: { ...searchParams.searchCriteria, and },
      };
    });
  }, [modifySearchParams]);

  const removeAndClause = useCallback(
    (clauseIndex: number) => {
      modifySearchParams((searchParams) => {
        const and = searchParams.searchCriteria?.and ?? [];
        and.splice(clauseIndex, 1);
        return {
          ...searchParams,
          searchCriteria: { ...searchParams.searchCriteria, and },
        };
      });
    },
    [modifySearchParams]
  );

  const rows = useMemo(() => {
    if (!searchCriteria.and?.length) {
      return (
        <div className={styles["empty-criteria-row"]}>
          <IconButton
            data-testid="add-and-clause-button"
            size="small"
            onClick={pushAndClause}
          >
            <Add />
          </IconButton>
          <Typography variant="body2">
            Filter highlights by adding criteria
          </Typography>
        </div>
      );
    }

    const clauses = (searchCriteria.and ?? []).map((and, i) => {
      const orDays = and.or
        ?.map((or) =>
          or.days?.days?.map((day) => IpsumDay.fromString(day, "url-format"))
        )
        .flat();
      const orArcIds = and.or
        ?.map((or) => or.relatesToArc?.arcId)
        .filter(Boolean);

      return (
        <div className={styles["and-clause"]} key={i}>
          <div className={styles["and-clause-minus"]}>
            <IconButton
              size="small"
              data-testid="remove-and-clause-button"
              onClick={() => {
                removeAndClause(i);
              }}
            >
              <Remove />
            </IconButton>
          </div>
          <div className={styles["and-clause-criteria"]}>
            <div>
              <Chip variant="outlined" label="From day" />
              {orDays?.map((day, i) => (
                <DayChip key={i} day={day} onChange={() => {}} />
              ))}
              <IconButton size="small">
                <Add />
              </IconButton>
            </div>
            <div>
              <Chip variant="outlined" label="Re: arc" />
              {orArcIds?.map((arcId, i) => (
                <ArcChipConnected
                  key={i}
                  arcId={arcId}
                  onClick={() => {}}
                  onDelete={() => {}}
                />
              ))}
              <IconButton size="small">
                <Add />
              </IconButton>
            </div>
          </div>
        </div>
      );
    });

    return (
      <>
        {clauses}
        <div className={styles["options-row"]}>
          <div className={styles["options-row-plus"]}>
            <IconButton
              data-testid="add-and-clause-button"
              size="small"
              onClick={pushAndClause}
            >
              <Add />
            </IconButton>
          </div>
          <div className={styles["options-row-options"]}>
            <Button>Reset</Button>
          </div>
        </div>
      </>
    );
  }, [pushAndClause, removeAndClause, searchCriteria.and]);

  return (
    <div className={styles["highlight-search-criteria-panel"]}>
      <div className={styles["search-criteria-grid"]}>{rows}</div>
    </div>
  );
};
