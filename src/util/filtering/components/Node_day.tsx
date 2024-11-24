import { Button } from "components/atoms/Button";
import { Popover } from "components/atoms/Popover";
import { DatePicker } from "components/molecules/DatePicker";
import React, { useCallback, useRef, useState } from "react";
import { IpsumDay } from "util/dates";

import { NodeComponent, NodeComponentProps } from "../types";
import { IpsumFilteringProgramV1 } from "../v1-filtering-program";

export const Node_day: NodeComponent = ({
  editMode,
  endowedNode,
  transformProgram,
  dataOnDay,
  childComponents,
}: NodeComponentProps) => {
  const [showPopover, setShowPopover] = useState(false);
  const popoverAnchorRef = useRef<HTMLButtonElement>();

  const day = IpsumFilteringProgramV1.evaluateDayNode(endowedNode);

  const onDaySelect = useCallback(
    (selectedDay: IpsumDay, buttonLabel?: string) => {
      let dayString = selectedDay.toString("stored-day");
      if (buttonLabel === "beginning") {
        dayString = "beginning";
      }
      if (buttonLabel === "today") {
        dayString = "today";
      }

      transformProgram((program) =>
        program.updateNodeText(endowedNode, `"${dayString}"`)
      );
      setShowPopover(false);
    },
    [transformProgram, endowedNode]
  );

  const popover = (
    <Popover
      open={showPopover}
      onClose={() => {
        setShowPopover(false);
      }}
      anchorEl={showPopover ? popoverAnchorRef.current : null}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
    >
      <DatePicker
        selectedDay={day}
        onSelect={onDaySelect}
        showButtonOptions
        dataOnDay={dataOnDay}
        buttonOptions={[
          { label: "beginning", day: IpsumDay.beginning() },
          { label: "today", day: IpsumDay.today() },
          { label: "1 month", day: IpsumDay.today().add(0, -1) },
          { label: "6 months", day: IpsumDay.today().add(0, -6) },
          { label: "1 year", day: IpsumDay.today().add(0, -12) },
        ]}
      />
    </Popover>
  );

  return editMode ? (
    <>
      <Button
        variant="link"
        ref={popoverAnchorRef}
        onClick={() => {
          setShowPopover(true);
        }}
      >
        {endowedNode.rawNode.text}
      </Button>
      {popover}
    </>
  ) : (
    <>{endowedNode.rawNode.text}</>
  );
};
