import { Button } from "components/atoms/Button";
import { Popover } from "components/atoms/Popover";
import { DatePicker } from "components/molecules/DatePicker";
import React, { useCallback, useRef, useState } from "react";
import { IpsumDay } from "util/dates";

import { IpsumFilteringProgramV1 } from "../ipsum-filtering-program-v1";
import { NodeComponent, NodeComponentProps } from "../types";
import { changeDay } from "./filter-tree-actions";

export const Node_day: NodeComponent = ({
  editMode,
  endowedNode,
  performAction,
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

      performAction(changeDay, { day: dayString, dayNode: endowedNode });
      setShowPopover(false);
    },
    [endowedNode, performAction]
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
