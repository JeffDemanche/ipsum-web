import { Card, Typography } from "@mui/material";
import { JournalEntryBreadcrumb } from "components/DiptychContext";
import React from "react";
import { useQuery } from "@apollo/client";
import { gql } from "util/apollo";
import styles from "./Breadcrumb.less";
import cx from "classnames";
import { parseIpsumDateTime } from "util/dates";

interface BreadcrumbJournalEntryProps {
  breadcrumb: JournalEntryBreadcrumb;
}

const BreadcrumbJournalEntryQuery = gql(`
  query BreadcrumbJournalEntryQuery($journalEntryId: ID!) {
    journalEntry(entryKey: $journalEntryId) {
      entryKey
      entry {
        date
      }
    }
  }
`);

export const BreadcrumbJournalEntry: React.FunctionComponent<
  BreadcrumbJournalEntryProps
> = ({ breadcrumb }) => {
  const { data } = useQuery(BreadcrumbJournalEntryQuery, {
    variables: {
      journalEntryId: breadcrumb.journalEntryId,
    },
  });

  const niceDate = parseIpsumDateTime(data.journalEntry.entry.date).toString(
    "entry-printed-date-nice"
  );

  return (
    <div className={cx(styles["breadcrumb"])}>
      <Card variant="translucent" className={styles["breadcrumb-card"]}>
        <Typography variant="caption">{niceDate}</Typography>
      </Card>
    </div>
  );
};
