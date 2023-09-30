import { Breadcrumb as BreadcrumbType } from "components/DiptychContext";
import React from "react";
import { BreadcrumbArc } from "./BreadcrumbArc";
import { BreadcrumbHighlight } from "./BreadcrumbHighlight";
import { BreadcrumbJournalEntry } from "./BreadcrumbJournalEntry";

interface BreadcrumbProps {
  breadcrumb: BreadcrumbType;
}

export const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = ({
  breadcrumb,
}) => {
  if (breadcrumb.type === "journal_entry") {
    return <BreadcrumbJournalEntry breadcrumb={breadcrumb} />;
  } else if (breadcrumb.type === "arc") {
    return <BreadcrumbArc breadcrumb={breadcrumb} />;
  } else if (breadcrumb.type === "highlight") {
    return <BreadcrumbHighlight breadcrumb={breadcrumb} />;
  }
};
