import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "./__generated__";

const TEST_QUERY = gql(`
  query TestQuery($entryKey: String!) {
    entries {
      entryKey
    }
  }
`);

export const TestComponent: React.FC = () => {
  const { data, error } = useQuery(TEST_QUERY);

  console.log(data, error);

  return <></>;
};
