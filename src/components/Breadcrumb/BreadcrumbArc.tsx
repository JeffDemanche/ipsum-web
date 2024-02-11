import { ArcChipConnected } from "components/ArcChip";
import React from "react";
import { ArcBreadcrumb } from "./types";

interface BreadcrumbArcProps {
  breadcrumb: ArcBreadcrumb;
}

export const BreadcrumbArc: React.FunctionComponent<BreadcrumbArcProps> = ({
  breadcrumb,
}) => {
  return <ArcChipConnected arcId={breadcrumb.arcId} />;
};
