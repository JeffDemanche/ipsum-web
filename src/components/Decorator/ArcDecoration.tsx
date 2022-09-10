import React, { useContext, useState } from "react";
import styles from "./ArcDecoration.less";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";

export const ArcDecoration: React.FC = (props: any) => {
  const arcId = props.contentState.getEntity(props.entityKey).getData().arcId;

  const { state } = useContext(InMemoryStateContext);

  const arc = state.arcs[arcId];

  const [isHovered, setIsHovered] = useState(false);

  const borderColor = arc ? `hsl(${arc?.color} 100% 50%)` : "black";
  const backgroundColor = arc
    ? `hsla(${arc?.color}, 100%, 50%, ${isHovered ? 0.4 : 0.25})`
    : `rgba(0, 0, 0, ${isHovered ? 0.4 : 0.25})`;

  return (
    <span
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={styles.arc}
      style={{ borderBottom: "2px solid", borderColor, backgroundColor }}
    >
      {props.children}
    </span>
  );
};
