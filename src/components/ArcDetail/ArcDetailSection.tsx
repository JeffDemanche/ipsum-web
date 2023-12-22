import React from "react";

interface ArcDetailSectionProps {
  children: React.ReactNode;
}

export const ArcDetailSection: React.FunctionComponent<
  ArcDetailSectionProps
> = ({ children }) => {
  return <section>{children}</section>;
};
