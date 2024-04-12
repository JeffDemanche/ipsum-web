import { Button } from "@mui/material";
import cx from "classnames";
import React, { useMemo } from "react";

import styles from "./Breadcrumb.less";
import { BreadcrumbArc } from "./BreadcrumbArc";
import { BreadcrumbHighlight } from "./BreadcrumbHighlight";
import { BreadcrumbJournalEntry } from "./BreadcrumbJournalEntry";
import { BreadcrumbType } from "./types";

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

  return (
    <div
      className={cx(
        styles["breadcrumb"],
        !layerVisible && styles["not-visible"]
      )}
    >
      <Button
        variant="outlined"
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
