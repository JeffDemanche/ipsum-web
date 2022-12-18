import React, { CSSProperties, useContext, useState } from "react";
import styles from "./ArcToken.less";
import { InMemoryStateContext } from "components/InMemoryStateContext/InMemoryStateContext";
import { Paper, Link, Typography } from "@mui/material";
import { IpsumArcColor, IpsumColor } from "util/colors";
import cx from "classnames";

type ArcForToken =
  | { type: "from id"; id: string }
  | { type: "from data"; color: number; name: string };

interface ArcToken {
  arcForToken: ArcForToken;
  type?: "span" | "header";
  highlighted?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ArcToken: React.FunctionComponent<ArcToken> = ({
  arcForToken,
  type = "span",
  highlighted,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { state } = useContext(InMemoryStateContext);

  const arc: { color: number; name: string } =
    arcForToken.type === "from id" ? state.arcs[arcForToken.id] : arcForToken;

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

  const innerTag =
    type === "span" ? (
      <span className={styles["arc-token-inner"]}>{arc?.name ?? "null"}</span>
    ) : (
      <h3 className={styles["arc-token-inner"]}>{arc?.name ?? "null"}</h3>
    );

  return (
    <Typography variant="body2" sx={{ margin: "2px" }}>
      <Paper
        className={cx(className, styles["arc-token-container"])}
        sx={style}
      >
        <Link
          href={"#"}
          onMouseEnter={() => {
            setHover(true);
            onMouseEnter?.();
          }}
          onMouseLeave={() => {
            setHover(false);
            onMouseLeave?.();
          }}
          className={styles["arc-token-a"]}
          onClick={onClick}
          style={style}
        >
          {innerTag}
        </Link>
      </Paper>
    </Typography>
  );
};
