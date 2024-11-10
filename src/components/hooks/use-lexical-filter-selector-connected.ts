import { LexicalFilterSelector } from "components/molecules/LexicalFilterSelector";
import { useState } from "react";

import { useRelationChooserConnected } from "./use-relation-chooser-connected";

export type LexicalFilterSelectorConnectedProps = Pick<
  React.ComponentProps<typeof LexicalFilterSelector>,
  | "editMode"
  | "onEnterEditMode"
  | "onLeaveEditMode"
  | "programText"
  | "onFilterProgramChange"
  | "relationChooserProps"
  | "arcByIdOrName"
>;

export const useLexicalFilterSelectorConnected =
  (): LexicalFilterSelectorConnectedProps => {
    const [editMode, setEditMode] = useState(false);

    const [programText, setProgramText] = useState(
      'highlights sorted by importance as of "today"'
    );

    const relationChooserProps = useRelationChooserConnected();

    const onEnterEditMode = () => {
      setEditMode(true);
    };

    const onLeaveEditMode = () => {
      setEditMode(false);
    };

    return {
      editMode,
      onEnterEditMode,
      onLeaveEditMode,
      programText,
      onFilterProgramChange: (programText) => {
        setProgramText(programText);
      },
      relationChooserProps,
      arcByIdOrName: () => {
        return undefined;
      },
    };
  };
