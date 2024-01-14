import React, { useCallback, useMemo } from "react";
import { URLSearchCriteria, useModifySearchParams } from "util/url";
import styles from "./HighlightSearchCriteriaPanel.less";
import { ArcChipConnected } from "components/ArcChip";
import { DayChip } from "components/DayChip";
import { IpsumDay } from "util/dates";
import { IconButton, Chip, Button, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import cx from "classnames";

export interface HighlightSearchCriteriaPanelProps {
  searchCriteria: URLSearchCriteria;
  isUserSearch: boolean;
}

const removeEmptyClauses = (searchCriteria: URLSearchCriteria) => {
  const and = searchCriteria.and?.filter((and) => {
    return and.or?.length;
  });

  if (!and?.length) {
    const noAnd = { ...searchCriteria };
    delete noAnd.and;
    return noAnd;
  }

  return { ...searchCriteria, and };
};

export const HighlightSearchCriteriaPanel: React.FC<
  HighlightSearchCriteriaPanelProps
> = ({ searchCriteria, isUserSearch }) => {
  const modifySearchParams = useModifySearchParams<"journal">();

  const pushAndClause = useCallback(() => {
    modifySearchParams((searchParams) => {
      // If the search criteria is "inferred" (not in the URL), get it from the
      // props instead and then add it to the URL.
      const activeSearchCriteria =
        searchParams.searchCriteria ?? searchCriteria;

      const and = activeSearchCriteria?.and ?? [];
      and.push({ or: [] });
      return {
        ...searchParams,
        searchCriteria: removeEmptyClauses({ ...activeSearchCriteria, and }),
      };
    });
  }, [modifySearchParams, searchCriteria]);

  const removeAndClause = useCallback(
    (clauseIndex: number) => {
      modifySearchParams((searchParams) => {
        const activeSearchCriteria =
          searchParams.searchCriteria ?? searchCriteria;

        const and = activeSearchCriteria?.and ?? [];
        and.splice(clauseIndex, 1);
        return {
          ...searchParams,
          searchCriteria: removeEmptyClauses({ ...activeSearchCriteria, and }),
        };
      });
    },
    [modifySearchParams, searchCriteria]
  );

  const pushOrDateClause = useCallback(
    (andIndex: number) => {
      modifySearchParams((searchParams) => {
        const activeSearchCriteria =
          searchParams.searchCriteria ?? searchCriteria;

        const and = activeSearchCriteria?.and ?? [];
        const or = and[andIndex].or ?? [];
        or.push({ days: { days: [IpsumDay.today().toString("url-format")] } });
        and[andIndex].or = or;
        return {
          ...searchParams,
          searchCriteria: removeEmptyClauses({ ...activeSearchCriteria, and }),
        };
      });
    },
    [modifySearchParams, searchCriteria]
  );

  const setOrDateClause = useCallback(
    (andIndex: number, orIndex: number, date: IpsumDay) => {},
    []
  );

  const removeOrDateClause = useCallback(
    (andIndex: number, orIndex: number) => {
      modifySearchParams((searchParams) => {
        const activeSearchCriteria =
          searchParams.searchCriteria ?? searchCriteria;

        const and = activeSearchCriteria?.and ?? [];
        const or = and[andIndex].or ?? [];
        or.splice(orIndex, 1);
        and[andIndex].or = or;
        return {
          ...searchParams,
          searchCriteria: removeEmptyClauses({ ...activeSearchCriteria, and }),
        };
      });
    },
    [modifySearchParams, searchCriteria]
  );

  const pushOrArcClause = useCallback((andIndex: number) => {}, []);

  const removeOrArcClause = useCallback(
    (andIndex: number, orIndex: number) => {},
    []
  );

  const onReset = useCallback(() => {
    modifySearchParams((searchParams) => {
      return {
        ...searchParams,
        searchCriteria: undefined,
      };
    });
  }, [modifySearchParams]);

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
              {orDays?.map((day, j) => (
                <DayChip
                  key={j}
                  day={day}
                  onChange={(day) => {
                    setOrDateClause(i, j, day);
                  }}
                  onDelete={() => {
                    removeOrDateClause(i, j);
                  }}
                />
              ))}
              <IconButton
                data-testid="add-or-clause-date-button"
                size="small"
                onClick={() => {
                  pushOrDateClause(i);
                }}
              >
                <Add />
              </IconButton>
            </div>
            <div>
              <Chip variant="outlined" label="Re: arc" />
              {orArcIds?.map((arcId, j) => (
                <ArcChipConnected
                  key={j}
                  arcId={arcId}
                  onClick={() => {}}
                  onDelete={() => {
                    removeOrArcClause(i, j);
                  }}
                />
              ))}
              <IconButton
                data-testid="add-or-clause-arc-button"
                size="small"
                onClick={() => {
                  pushOrArcClause(i);
                }}
              >
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
            <Button onClick={onReset}>Reset</Button>
          </div>
        </div>
      </>
    );
  }, [
    onReset,
    pushAndClause,
    pushOrArcClause,
    pushOrDateClause,
    removeAndClause,
    removeOrArcClause,
    removeOrDateClause,
    searchCriteria.and,
    setOrDateClause,
  ]);

  return (
    <div
      className={cx(
        styles["highlight-search-criteria-panel"],
        !isUserSearch && styles["inferred"]
      )}
    >
      <div className={styles["search-criteria-grid"]}>{rows}</div>
    </div>
  );
};
