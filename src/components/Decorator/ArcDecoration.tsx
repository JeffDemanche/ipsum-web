import React, { useContext, useState } from "react";
import styles from "./ArcDecoration.less";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";

export const ArcDecoration: React.FC = (props: any) => {
  const arcIds = props.contentState.getEntity(props.entityKey).getData()
    .arcIds as string[];

  const { state } = useContext(InMemoryStateContext);

  const arcs = arcIds?.map((id) => state.arcs[id]).filter((arc) => !!arc) ?? [];

  const [isHovered, setIsHovered] = useState(false);

  const boxShadow = arcs.reduce(
    (acc, cur, i): string =>
      `${acc} 0 0 0 ${(i + 1) * 2}px hsla(${cur.color}, 100%, 50%, ${
        isHovered ? 0.4 : 0.25
      })${i === arcs.length - 1 ? "" : ","}`,
    ""
  );

  const avgHue = Math.round(
    arcs.reduce((acc, cur) => acc + cur.color, 0) / arcs.length
  );

  const backgroundColor = arcs
    ? `hsla(${avgHue}, 100%, 50%, ${isHovered ? 0.2 : 0.05})`
    : `rgba(0, 0, 0, ${isHovered ? 0.2 : 0.05})`;

  return (
    <span
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={styles.arc}
      style={{ boxShadow, backgroundColor }}
    >
      {props.children}
    </span>
  );
};
