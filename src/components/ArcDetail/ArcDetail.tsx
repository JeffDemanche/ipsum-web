import React from "react";
import { ArcDetailPrefsBox } from "components/ArcDetailPrefsBox/ArcDetailPrefsBox";
import { useOpenArc } from "components/SelectionContext/useOpenArc";
import styles from "./ArcDetail.less";

export const ArcDetail: React.FC = () => {
  return <ArcDetailPrefsBox></ArcDetailPrefsBox>;
};
