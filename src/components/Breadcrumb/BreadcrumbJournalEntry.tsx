import { JournalEntryBreadcrumb } from "components/DiptychContext";
import React from "react";

interface BreadcrumbJournalEntryProps {
  breadcrumb: JournalEntryBreadcrumb;
}

export const BreadcrumbJournalEntry: React.FunctionComponent<
  BreadcrumbJournalEntryProps
> = ({ breadcrumb }) => {
  return <div>journal entry</div>;
};
