import React, { useContext } from "react";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";

export const ArcDecoration: React.FC = (props: any) => {
  const arcId = props.contentState.getEntity(props.entityKey).getData().arcId;

  const { state } = useContext(InMemoryStateContext);

  const arc = state.arcs[arcId];

  const color = arc ? `hsl(${arc?.color} 100% 50%)` : "black";

  return (
    <span style={{ borderBottom: "2px solid", borderColor: color }}>
      {props.children}
    </span>
  );
};
