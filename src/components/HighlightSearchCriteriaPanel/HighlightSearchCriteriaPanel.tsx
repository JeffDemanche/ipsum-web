import React, { useCallback, useMemo, useState } from "react";
import { URLSearchCriteria, useModifySearchParams } from "util/url";
import styles from "./HighlightSearchCriteriaPanel.less";
import { ArcChipConnected } from "components/ArcChip";
import { DayChip } from "components/DayChip";
import { IpsumDay } from "util/dates";
import { IconButton, Chip, Button, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import cx from "classnames";
import { ArcSearchAutocomplete } from "components/ArcSearchAutocomplete";
import { createArc } from "util/apollo";

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
      // If the search criteria is "inferred" (not in the URL), get it from the
      // props instead and then add it to the URL.
      const activeSearchCriteria =
        searchParams.searchCriteria ?? searchCriteria;

      const and = activeSearchCriteria?.and ?? [];
      and.push({ or: [] });
      return {
        ...searchParams,
        searchCriteria: { ...activeSearchCriteria, and },
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
          searchCriteria: { ...activeSearchCriteria, and },
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
          searchCriteria: { ...activeSearchCriteria, and },
        };
      });
    },
    [modifySearchParams, searchCriteria]
  );

  const setOrDateClause = useCallback(
    (andIndex: number, orIndex: number, date: IpsumDay) => {
      modifySearchParams((searchParams) => {
        const activeSearchCriteria =
          searchParams.searchCriteria ?? searchCriteria;

        const and = activeSearchCriteria?.and ?? [];
        const or = and[andIndex].or ?? [];
        or[orIndex].days = { days: [date.toString("url-format")] };
        and[andIndex].or = or;
        return {
          ...searchParams,
          searchCriteria: { ...activeSearchCriteria, and },
        };
      });
    },
    [modifySearchParams, searchCriteria]
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
          searchCriteria: { ...activeSearchCriteria, and },
        };
      });
    },
    [modifySearchParams, searchCriteria]
  );

  const setOrArcClauses = useCallback(
    (andIndex: number, arcIds: string[]) => {
      modifySearchParams((searchParams) => {
        const activeSearchCriteria =
          searchParams.searchCriteria ?? searchCriteria;

        const and = activeSearchCriteria?.and ?? [];
        const or = arcIds.map((arcId) => ({ relatesToArc: { arcId } }));
        and[andIndex].or = or;
        return {
          ...searchParams,
          searchCriteria: { ...activeSearchCriteria, and },
        };
      });
    },
    [modifySearchParams, searchCriteria]
  );

  const removeOrArcClause = useCallback(
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
          searchCriteria: { ...activeSearchCriteria, and },
        };
      });
    },
    [modifySearchParams, searchCriteria]
  );

  const onReset = useCallback(() => {
    modifySearchParams((searchParams) => {
      return {
        ...searchParams,
        searchCriteria: undefined,
      };
    });
  }, [modifySearchParams]);

  const [expandedArcAutocomplete, setExpandedArcAutocomplete] = useState<
    number | undefined
  >();

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
          <div className={styles["empty-criteria-copy"]}>
            <Typography variant="body2">
              Filter highlights by adding criteria
            </Typography>
            <Button size="small" variant="outlined" onClick={onReset}>
              Reset
            </Button>
          </div>
        </div>
      );
    }

    const clauses = (searchCriteria.and ?? []).map((and, i) => {
      const orDays = and.or
        ?.map((or) =>
          or.days?.days?.map((day) => IpsumDay.fromString(day, "url-format"))
        )
        .flat();
      const orArcIds = and.or?.map((or) => or.relatesToArc?.arcId);

      const autocompleteExpanded = expandedArcAutocomplete === i;

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
            <div className={styles["and-clause-days"]}>
              <Chip variant="outlined" label="From day" />
              {orDays?.map((day, j) => {
                if (!day) return null;

                return (
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
                );
              })}
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
            <div className={styles["and-clause-arcs"]}>
              <Chip variant="outlined" label="Re: arc" />
              {!autocompleteExpanded &&
                orArcIds?.map((arcId, j) => {
                  if (!arcId) return null;
                  return (
                    <ArcChipConnected
                      key={j}
                      arcId={arcId}
                      onClick={() => {}}
                      onDelete={() => {
                        removeOrArcClause(i, j);
                      }}
                    />
                  );
                })}
              <ArcSearchAutocomplete
                className={styles["arc-autocomplete"]}
                allowCreate
                multiple
                value={orArcIds}
                onNewArc={(name) => {
                  return createArc({ name }).id;
                }}
                onChange={(arcs) => {
                  setOrArcClauses(
                    i,
                    arcs.map((arc) => arc.arcId)
                  );
                }}
                onExpand={() => {
                  setExpandedArcAutocomplete(i);
                }}
                onCollapse={() => {
                  setExpandedArcAutocomplete(undefined);
                }}
              />
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
            <Button size="small" variant="outlined" onClick={onReset}>
              Reset
            </Button>
          </div>
        </div>
      </>
    );
  }, [
    expandedArcAutocomplete,
    onReset,
    pushAndClause,
    pushOrDateClause,
    removeAndClause,
    removeOrArcClause,
    removeOrDateClause,
    searchCriteria.and,
    setOrArcClauses,
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
