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
  const modifySearchCriteria = useModifySearchParams();

  const pushAndClause = useCallback(() => {}, [modifySearchCriteria]);

  const removeAndClause = useCallback(
    (clauseIndex: number) => {},
    [modifySearchCriteria]
  );

  const rows = useMemo(() => {
    if (!searchCriteria.and?.length) {
      return (
        <div className={styles["empty-criteria-row"]}>
          <IconButton size="small">
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
            <IconButton size="small">
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
            <IconButton size="small">
              <Add />
            </IconButton>
          </div>
          <div className={styles["options-row-options"]}>
            <Button>Reset</Button>
          </div>
        </div>
      </>
    );
  }, [searchCriteria.and]);

  return (
    <div className={styles["highlight-search-criteria-panel"]}>
      <div className={styles["search-criteria-grid"]}>{rows}</div>
    </div>
  );
};
