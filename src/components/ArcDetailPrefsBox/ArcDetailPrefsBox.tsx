import React, { useCallback, useContext, useState } from "react";
import { Slider, Typography } from "@mui/material";
import styles from "./ArcDetailPrefsBox.less";
import { IpsumArcColor } from "util/colors";
import { ArcDetailContext, ArcDetailSection } from "components/ArcDetail";
import { gql, updateArc } from "util/apollo";
import { useQuery } from "@apollo/client";

const ArcDetailPrefsBoxQuery = gql(`
  query ArcDetailPrefsBox($arcId: ID!) {
    arc(id: $arcId) {
      id
      name
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
      <Typography
        variant="h3"
        sx={{
          backgroundColor: color
            .toIpsumColor({ lightness: 30, saturation: 50 })
            .toRgbaCSS(),
        }}
      >
        {arc.name}
      </Typography>
      <Slider
        min={0}
        max={359}
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
