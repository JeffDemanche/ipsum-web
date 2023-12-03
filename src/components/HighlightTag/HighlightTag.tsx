import React, { CSSProperties, useState } from "react";
import styles from "./HighlightTag.less";
import { Link, Typography } from "@mui/material";
import { IpsumArcColor, IpsumColor } from "util/colors";
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
      hue
      outgoingRelations {
        id
        object {
          __typename
          ... on Arc {
            id
            name
            color
          }
        }
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
      highlight: { outgoingRelations },
    },
  } = useQuery(HighlightTagQuery, {
    variables: { highlightId },
  });

  const maxArcsInName = 3;

  const name = React.useMemo(() => {
    return outgoingRelations.length
      ? outgoingRelations.slice(0, maxArcsInName).reduce((acc, relation, i) => {
          return i === 0
            ? `${relation.object.name}`
            : `${acc}/${relation.object.name}`;
        }, "")
      : "(no arcs)";
  }, [outgoingRelations]);

  const firstArc = outgoingRelations[0]?.object;

  const [hover, setHover] = useState(false);

  const ipsumColorL50 = firstArc
    ? new IpsumArcColor(firstArc.color).toIpsumColor({
        saturation: 50,
        lightness: 50,
      })
    : new IpsumColor("hsl", [0, 0, 50]);
  const ipsumColorL30 = firstArc
    ? new IpsumArcColor(firstArc.color).toIpsumColor({
        saturation: 50,
        lightness: 30,
      })
    : new IpsumColor("hsl", [0, 0, 30]);

  const backgroundColor = ipsumColorL50.setAlpha(0.05).toRgbaCSS();
  const backgroundColorHighlighted = ipsumColorL50.setAlpha(0.2).toRgbaCSS();

  const boxShadow = `0 2px 0 0 ${ipsumColorL50.setAlpha(0.25).toRgbaCSS()}`;
  const boxShadowHighlighted = `0 2px 0 0 ${ipsumColorL50
    .setAlpha(0.4)
    .toRgbaCSS()}`;

  const style: CSSProperties =
    hover || highlighted
      ? {
          color: ipsumColorL30.toRgbaCSS(),
          boxShadow: boxShadowHighlighted,
          backgroundColor: backgroundColorHighlighted,
        }
      : {
          color: ipsumColorL30.toRgbaCSS(),
          boxShadow,
          backgroundColor,
        };

  return (
    <Typography component={"span"} variant={type === "span" ? "body2" : "h3"}>
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
        {name ?? "null"}
      </Link>
    </Typography>
  );
};
