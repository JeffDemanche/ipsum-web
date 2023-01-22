import React, { useCallback, useState } from "react";
import { Paper, Slider } from "@mui/material";
import { useOpenArc } from "components/SelectionContext/useOpenArc";
import styles from "./ArcDetailPrefsBox.less";
import { IpsumArcColor } from "util/colors";
import { ArcToken } from "components/Arc/ArcToken";
import { useApiAction } from "state/api/SCH_use-api-action";

export const ArcDetailPrefsBox: React.FC = () => {
  const { arc } = useOpenArc();
  const { act: updateArc } = useApiAction({ name: "updateArc" });

  const [localColor, setLocalColor] = useState(arc.color);

  const onColorSliderChange = useCallback((event: Event, value: number) => {
    setLocalColor(value);
  }, []);

  const onColorSliderChangeCommitted = useCallback(
    (event: Event, value: number) => {
      updateArc({ arcId: arc.id, color: value });
    },
    [arc.id, updateArc]
  );

  const color = new IpsumArcColor(localColor);

  return (
    <Paper
      className={styles["colorful-backdrop"]}
      sx={{
        backgroundColor: color
          .toIpsumColor({ saturation: 50, lightness: 50 })
          .toRgbaCSS(),
      }}
    >
      <Paper className={styles["foreground"]}>
        <ArcToken
          arcForToken={{ type: "from id", id: arc.id }}
          type="header"
        ></ArcToken>
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
      </Paper>
    </Paper>
  );
};
