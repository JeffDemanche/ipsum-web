import React, { useContext } from "react";
import { IpsumColor } from "util/colors";
import { ArcDetailContext } from "./ArcDetailContext";
import styles from "./ArcDetailSection.less";

interface ArcDetailSectionProps {
  children: React.ReactNode;
}

export const ArcDetailSection: React.FunctionComponent<
  ArcDetailSectionProps
> = ({ children }) => {
  const { arc } = useContext(ArcDetailContext);

  return (
    <section
      style={{
        borderColor: new IpsumColor("hsl", [arc.color, 50, 50]).toRgbaCSS(),
      }}
      className={styles["arc-detail-section"]}
    >
      {children}
    </section>
  );
};
