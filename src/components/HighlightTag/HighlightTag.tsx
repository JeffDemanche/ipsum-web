import React, { CSSProperties, useState } from "react";
import styles from "./HighlightTag.less";
import { Paper, Link, Typography } from "@mui/material";
import { IpsumArcColor, IpsumColor } from "util/colors";
import cx from "classnames";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";

interface HighlightTagProps {
  highlightId: string;
  type?: "span" | "header";
  highlighted?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const HighlightTagQuery = gql(`
  query HighlightTag($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      arc {
        id
        name
        color
      }
    }
  }
`);

export const HighlightTag: React.FunctionComponent<HighlightTagProps> = ({
  highlightId,
  type = "span",
  highlighted,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const {
    data: {
      highlight: { arc },
    },
  } = useQuery(HighlightTagQuery, {
    variables: { highlightId },
  });

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
          color: ipsumColorL30.toRgbaCSS(),
          textDecorationColor: ipsumColorL30.toRgbaCSS(),
          backgroundColor: ipsumColorL80.toRgbaCSS(),
        }
      : {
          color: ipsumColorL30.toRgbaCSS(),
          textDecorationColor: ipsumColorL30.toRgbaCSS(),
          backgroundColor: ipsumColorL90.toRgbaCSS(),
        };

  const innerTag =
    type === "span" ? (
      <span className={styles["highlight-tag-inner"]}>
        {arc?.name ?? "null"}
      </span>
    ) : (
      <h3 className={styles["highlight-tag-inner"]}>{arc?.name ?? "null"}</h3>
    );

  return (
    <Paper
      className={cx(className, styles["highlight-tag-container"])}
      sx={style}
    >
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
          className={styles["highlight-tag-a"]}
          onClick={onClick}
          style={style}
        >
          {arc?.name ?? "null"}
        </Link>
      </Typography>
    </Paper>
  );
};
