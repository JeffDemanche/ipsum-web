import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";
import { ArcChip, ArcChipProps } from "./ArcChip";

interface ArcChipConnectedProps {
  arcId: string;
}

const ArcChipConnectedQuery = gql(`
  query ArcChipConnectedQuery($arcId: ID!) {
    arc(id: $arcId) {
      id
      name
      color
    }
  }
`);

export const ArcChipConnected: React.FC<
  ArcChipConnectedProps & Omit<ArcChipProps, "label" | "hue">
> = ({ arcId, chipProps }) => {
  const { data } = useQuery(ArcChipConnectedQuery, {
    variables: { arcId },
  });

  return (
    <ArcChip
      chipProps={chipProps}
      label={data?.arc?.name ?? "null"}
      hue={data?.arc?.color ?? 0}
    />
  );
};
