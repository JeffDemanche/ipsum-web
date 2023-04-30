import React, { useCallback, useContext, useState } from "react";
import { Slider } from "@mui/material";
import styles from "./ArcDetailPrefsBox.less";
import { IpsumArcColor } from "util/colors";
import { ArcDetailContext, ArcDetailSection } from "components/ArcDetail";
import { ArcTag } from "components/ArcTag";
import { gql, updateArc } from "util/apollo";
import { useQuery } from "@apollo/client";

const ArcDetailPrefsBoxQuery = gql(`
  query ArcDetailPrefsBox($arcId: ID!) {
    arc(id: $arcId) {
      id
      color
    }
  } 
`);

export const ArcDetailPrefsBox: React.FC = () => {
  const { arcId } = useContext(ArcDetailContext);

  const {
    data: { arc },
  } = useQuery(ArcDetailPrefsBoxQuery, { variables: { arcId } });

  const [localColor, setLocalColor] = useState(arc.color);

  const onColorSliderChange = useCallback((event: Event, value: number) => {
    setLocalColor(value);
  }, []);

  const onColorSliderChangeCommitted = useCallback(
    (event: Event, value: number) => {
      updateArc({ id: arc.id, color: value });
    },
    [arc.id]
  );

  const color = new IpsumArcColor(localColor);

  return (
    <ArcDetailSection>
      <ArcTag
        arcForToken={{ type: "from id", id: arc.id }}
        type="header"
      ></ArcTag>
      <Slider
        min={0}
        max={255}
        onChange={onColorSliderChange}
        onChangeCommitted={onColorSliderChangeCommitted}
        value={localColor}
        valueLabelDisplay="auto"
        sx={{
          color: color
            .toIpsumColor({ saturation: 50, lightness: 30 })
            .toRgbaCSS(),
        }}
      ></Slider>
    </ArcDetailSection>
  );
};
