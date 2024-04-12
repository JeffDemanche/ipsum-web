import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import React from "react";
import { gql } from "util/apollo";
import { parseIpsumDateTime } from "util/dates";

import { JournalEntryBreadcrumb } from "./types";

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
      journalEntryId: breadcrumb?.journalEntryId,
    },
  });

  const text = data?.journalEntry?.entry
    ? parseIpsumDateTime(data?.journalEntry?.entry.date).toString(
        "entry-printed-date-nice"
      )
    : "Daily journal";

  return <Typography variant="caption">{text}</Typography>;
};
