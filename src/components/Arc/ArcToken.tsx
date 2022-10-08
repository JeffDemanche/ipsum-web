import React, { CSSProperties, useContext, useState } from "react";
import styles from "./ArcToken.less";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { Link } from "@mui/material";
import { IpsumArcColor } from "util/colors";

interface ArcToken {
  arcId: string;
  selected?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ArcToken: React.FunctionComponent<ArcToken> = ({
  arcId,
  selected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { state } = useContext(InMemoryStateContext);

  const arc = state.arcs[arcId];

  const [hover, setHover] = useState(false);

  const style: CSSProperties =
    hover || selected
      ? {
          color: new IpsumArcColor(arc.color).toHsla(50, 90, 1),
          textDecorationColor: new IpsumArcColor(arc.color).toHsla(50, 90, 1),
          backgroundColor: new IpsumArcColor(arc.color).toHsla(50, 50, 1),
        }
      : {
          color: new IpsumArcColor(arc.color).toHsla(50, 80, 1),
          textDecorationColor: new IpsumArcColor(arc.color).toHsla(50, 80, 1),
          backgroundColor: new IpsumArcColor(arc.color).toHsla(50, 30, 1),
        };

  return (
    <Link
      href={"#"}
      onMouseEnter={() => {
        setHover(true);
        onMouseEnter();
      }}
      onMouseLeave={() => {
        setHover(false);
        onMouseLeave();
      }}
      onClick={onClick}
      style={style}
      className={styles["arc-token"]}
    >
      {arc.name}
    </Link>
  );
};
