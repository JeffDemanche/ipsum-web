import { HighlightBreadcrumb } from "components/DiptychContext";
import React from "react";

interface BreadcrumbHighlightProps {
  breadcrumb: HighlightBreadcrumb;
}

export const BreadcrumbHighlight: React.FunctionComponent<
  BreadcrumbHighlightProps
> = ({ breadcrumb }) => {
  return <div>highlight</div>;
};
