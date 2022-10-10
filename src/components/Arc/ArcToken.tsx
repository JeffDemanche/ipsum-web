import React, { CSSProperties, useContext, useState } from "react";
import cx from "classnames";
import styles from "./ArcToken.less";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { Link } from "@mui/material";
import { IpsumArcColor, IpsumColor } from "util/colors";

interface ArcToken {
  arcId: string;
  highlighted?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ArcToken: React.FunctionComponent<ArcToken> = ({
  arcId,
  highlighted,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { state } = useContext(InMemoryStateContext);

  const arc = state.arcs[arcId];

  const [hover, setHover] = useState(false);

  const ipsumColorL90 = arc
    ? new IpsumArcColor(arc.color).toIpsumColor({
        saturation: 50,
        lightness: 90,
      })
    : new IpsumColor("hsl", [0, 0, 90]);
  const ipsumColorL80 = arc
    ? new IpsumArcColor(arc.color).toIpsumColor({
        saturation: 50,
        lightness: 80,
      })
    : new IpsumColor("hsl", [0, 0, 80]);
  const ipsumColorL50 = arc
    ? new IpsumArcColor(arc.color).toIpsumColor({
        saturation: 50,
        lightness: 50,
      })
    : new IpsumColor("hsl", [0, 0, 50]);
  const ipsumColorL30 = arc
    ? new IpsumArcColor(arc.color).toIpsumColor({
        saturation: 50,
        lightness: 30,
      })
    : new IpsumColor("hsl", [0, 0, 30]);

  const style: CSSProperties =
    hover || highlighted
      ? {
          color: ipsumColorL90.toRgbaCSS(),
          textDecorationColor: ipsumColorL90.toRgbaCSS(),
          backgroundColor: ipsumColorL50.toRgbaCSS(),
        }
      : {
          color: ipsumColorL80.toRgbaCSS(),
          textDecorationColor: ipsumColorL80.toRgbaCSS(),
          backgroundColor: ipsumColorL30.toRgbaCSS(),
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
      className={cx(styles["arc-token"], className)}
    >
      {arc?.name ?? "null"}
    </Link>
  );
};
