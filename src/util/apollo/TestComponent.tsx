import { gql, useQuery } from "@apollo/client";
import React from "react";

export const TestComponent: React.FC = () => {
  const { data, error } = useQuery(gql`
    query TestQuery($entryKey: String!) {
      entries {
        entryKey
      }
    }
  `);

  console.log(data, error);

  return <></>;
};
