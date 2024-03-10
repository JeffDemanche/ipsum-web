import { useQuery } from "@apollo/client";
import { Paper, Typography } from "@mui/material";
import { LayerContext } from "components/Diptych";
import { HighlightTag } from "components/HighlightTag";
import { LayerHeader } from "components/LayerHeader";
import React, { useContext } from "react";
import { gql } from "util/apollo";
import { IpsumDateTime } from "util/dates";
import styles from "./HighlightDetail.less";
import { HighlightDetailCommentsSection } from "./HighlightDetailCommentsSection";
import { HighlightDetailExcerptSection } from "./HighlightDetailExcerptSection";
import { HighlightDetailRelationsSection } from "./HighlightDetailRelationsSection";

const HighlightDetailQuery = gql(`
  query HighlightDetail($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      excerpt
      history {
        dateCreated
      }
    }
  }
`);

export const HighlightDetail: React.FunctionComponent = () => {
  const { layer } = useContext(LayerContext);
  if (layer.type !== "highlight_detail") {
    throw new Error(
      "HighlightDetail component used outside of highlight_detail layer"
    );
  }

  const highlightId = layer.highlightId;

  const { data } = useQuery(HighlightDetailQuery, {
    variables: { highlightId },
  });

  return (
    <Paper className={styles["highlight-detail"]} variant="shadowed">
      <LayerHeader />
      <Typography variant="h3">
        {IpsumDateTime.fromString(
          data.highlight.history.dateCreated,
          "iso"
        ).toString("entry-printed-date-nice-with-year")}
      </Typography>
      <HighlightTag type="header" highlightId={highlightId} />
      <HighlightDetailRelationsSection />
      <HighlightDetailExcerptSection
        excerpt={data.highlight.excerpt}
        highlightId={highlightId}
      />
      <HighlightDetailCommentsSection />
    </Paper>
  );
};
