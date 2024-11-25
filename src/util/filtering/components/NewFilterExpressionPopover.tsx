import { MenuItem } from "components/atoms/MenuItem";
import { Popover } from "components/atoms/Popover";
import { RelationChooserConnectedProps } from "components/hooks/use-relation-chooser-connected";
import { RelationChooser } from "components/molecules/RelationChooser";
import React, { useState } from "react";

interface NewFilterExpressionPopoverProps {
  show: boolean;
  setShow: (show: boolean) => void;

  relationChooserProps: RelationChooserConnectedProps;

  anchorEl: HTMLElement;

  onCreateDatesFilter: () => void;
  onRelationChoose: (relation: { predicate: string; objectId: string }) => void;
}

export const NewFilterExpressionPopover: React.FunctionComponent<
  NewFilterExpressionPopoverProps
> = ({
  show,
  setShow,
  relationChooserProps,
  anchorEl,
  onCreateDatesFilter,
  onRelationChoose,
}) => {
  const [choosingRelation, setChoosingRelation] = useState(false);

  return (
    <Popover
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={() => {
        setShow(false);
        setChoosingRelation(false);
      }}
      anchorEl={anchorEl}
      open={show}
    >
      {choosingRelation ? (
        <RelationChooser
          {...relationChooserProps}
          onRelationChoose={(relation) => {
            onRelationChoose(relation);
            setChoosingRelation(false);
          }}
          maxArcResults={5}
        />
      ) : (
        <>
          <MenuItem
            onClick={() => {
              setShow(false);
              onCreateDatesFilter();
            }}
          >
            by dates
          </MenuItem>
          <MenuItem
            onClick={() => {
              setChoosingRelation(true);
            }}
          >
            by relation
          </MenuItem>
        </>
      )}
    </Popover>
  );
};
