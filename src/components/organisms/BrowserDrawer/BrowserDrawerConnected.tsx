import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";

import { BrowserDrawer } from "./BrowserDrawer";

interface BrowserDrawerConnectedProps {}

const BrowserDrawerQuery = gql(`
  query BrowserDrawerQuery() {

  }
`);

export const BrowserDrawerConnected: React.FunctionComponent<
  BrowserDrawerConnectedProps
> = () => {
  return <></>;
  // const { data } = useQuery(BrowserDrawerQuery);

  // return <BrowserDrawer highlightsTabProps={{highlights: }} />;
};
