import React, { CSSProperties, useCallback, useState } from "react";
import styles from "./ArcTag.less";
import { Paper, Link, Typography } from "@mui/material";
import { IpsumArcColor, IpsumColor } from "util/colors";
import cx from "classnames";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";

type ArcForTag =
  | { type: "from id"; id: string }
  | { type: "from data"; color: number; name: string };

interface ArcTag {
  arcForToken: ArcForTag;
  type?: "span" | "header";
  highlighted?: boolean;
  className?: string;
  onClick?: (arcId?: string, e?: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ArcTagQuery = gql(`
  query ArcTag($arcId: ID!) {
    arc(id: $arcId) {
      id
      color
      name
    }
  }
`);

export const ArcTag: React.FunctionComponent<ArcTag> = ({
  arcForToken,
  type = "span",
  highlighted,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { data } = useQuery(ArcTagQuery, {
    variables: {
      arcId: arcForToken.type === "from id" ? arcForToken.id : undefined,
    },
    skip: arcForToken.type === "from data",
  });

  const arc: { color: number; name: string } =
    arcForToken.type === "from id" ? data.arc : arcForToken;

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

  const onLinkClick = useCallback(
    (e: React.MouseEvent) => {
      if (arcForToken.type === "from data") onClick?.(undefined, e);
      else if (arcForToken.type === "from id") onClick?.(arcForToken.id, e);
    },
    [arcForToken, onClick]
  );

  return (
    <Paper className={cx(className, styles["arc-token-container"])} sx={style}>
      <Typography variant={type === "span" ? "body2" : "h3"}>
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
          onClick={onLinkClick}
          style={style}
        >
          {arc?.name ?? "null"}
        </Link>
      </Typography>
    </Paper>
  );
};
