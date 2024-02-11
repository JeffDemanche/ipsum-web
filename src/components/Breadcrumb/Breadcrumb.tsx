import React, { useMemo, useState } from "react";
import { BreadcrumbArc } from "./BreadcrumbArc";
import { BreadcrumbHighlight } from "./BreadcrumbHighlight";
import { BreadcrumbJournalEntry } from "./BreadcrumbJournalEntry";
import styles from "./Breadcrumb.less";
import { BreadcrumbType } from "./types";
import { Button, Card, CardContent } from "@mui/material";
import cx from "classnames";

interface BreadcrumbProps {
  breadcrumb: BreadcrumbType;
  layerVisible: boolean;
}

export const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = ({
  breadcrumb,
  layerVisible,
}) => {
  const breadcrumbMarkup = useMemo(() => {
    if (breadcrumb.type === "journal_entry") {
      return <BreadcrumbJournalEntry breadcrumb={breadcrumb} />;
    } else if (breadcrumb.type === "arc") {
      return <BreadcrumbArc breadcrumb={breadcrumb} />;
    } else if (breadcrumb.type === "highlight") {
      return <BreadcrumbHighlight breadcrumb={breadcrumb} />;
    }
  }, [breadcrumb]);

  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cx(
        styles["breadcrumb"],
        !layerVisible && styles["not-visible"]
      )}
    >
      <Button
        variant="outlined"
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
        className={cx(styles["breadcrumb-button"])}
        sx={{
          padding: "0",
        }}
      >
        {breadcrumbMarkup}
      </Button>
    </div>
  );
};
