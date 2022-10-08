import React, { CSSProperties, useContext, useState } from "react";
import cx from "classnames";
import styles from "./ArcToken.less";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { Link } from "@mui/material";
import { IpsumArcColor } from "util/colors";

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

  const style: CSSProperties =
    hover || highlighted
      ? {
          color: new IpsumArcColor(arc.color)
            .toIpsumColor({ saturation: 50, lightness: 90 })
            .toRgbaCSS(),
          textDecorationColor: new IpsumArcColor(arc.color)
            .toIpsumColor({ saturation: 50, lightness: 90 })
            .toRgbaCSS(),
          backgroundColor: new IpsumArcColor(arc.color)
            .toIpsumColor({ saturation: 50, lightness: 50 })
            .toRgbaCSS(),
        }
      : {
          color: new IpsumArcColor(arc.color)
            .toIpsumColor({ saturation: 50, lightness: 80 })
            .toRgbaCSS(),
          textDecorationColor: new IpsumArcColor(arc.color)
            .toIpsumColor({ saturation: 50, lightness: 80 })
            .toRgbaCSS(),
          backgroundColor: new IpsumArcColor(arc.color)
            .toIpsumColor({ saturation: 50, lightness: 30 })
            .toRgbaCSS(),
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
      {arc.name}
    </Link>
  );
};
