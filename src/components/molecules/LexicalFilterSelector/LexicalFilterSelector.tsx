import { KeyboardArrowUpSharp } from "@mui/icons-material";
import { Button } from "components/atoms/Button";
import { ToggleButton } from "components/atoms/ToggleButton";
import { RelationChooserConnectedProps } from "components/hooks/use-relation-chooser-connected";
import React, {
  createElement,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createFilteringProgram,
  EndowedNode,
  IpsumFilteringProgram,
  NodeComponentProps,
} from "util/filtering";

import styles from "./LexicalFilterSelector.less";

export interface LexicalFilterSelectorConnectionProps {}

type LexicalFilterSelectorProps = {
  editMode: boolean;
  onEnterEditMode: () => void;
  onLeaveEditMode: () => void;

  programText: string;
  onFilterProgramChange: (
    programText: string,
    filterProgram: IpsumFilteringProgram
  ) => void;

  relationChooserProps: RelationChooserConnectedProps;

  arcByIdOrName: (idOrName: string) => {
    id: string;
    name: string;
    color: number;
  };
};

export const LexicalFilterSelector: React.FunctionComponent<
  LexicalFilterSelectorProps
> = ({
  editMode,
  onEnterEditMode,
  onLeaveEditMode,
  programText,
  onFilterProgramChange,
  relationChooserProps,
}) => {
  const [rawMode, setRawMode] = useState(false);

  const [currentProgram, setCurrentProgram] = useState(() => {
    const program = createFilteringProgram("v1");
    program.setProgram(programText);
    return program;
  });

  useEffect(() => {
    setCurrentProgram((program) => {
      return program.setProgram(programText);
    });
  }, [programText]);

  const createNodeMarkupRecursive = useCallback(
    (node: EndowedNode): JSX.Element => {
      if (!node.component) return null;

      return createElement<NodeComponentProps>(node.component as FC, {
        editMode,
        endowedNode: node,
        key: node.coordinates.join("-"),
        relationChooserProps,
        transformProgram: (transform) => {
          const newProgram = transform(currentProgram);
          newProgram.errors.forEach((error) => {
            console.error(error);
          });

          onFilterProgramChange?.(newProgram.programString, newProgram);
          setCurrentProgram(newProgram);
          return true;
        },

        childComponents: node.children
          .map((child) => createNodeMarkupRecursive(child))
          .filter(Boolean),
      });
    },
    [currentProgram, editMode, onFilterProgramChange, relationChooserProps]
  );

  const markupTree = useMemo(() => {
    const endowedAST = currentProgram.getEndowedAST();

    return createNodeMarkupRecursive(endowedAST);
  }, [createNodeMarkupRecursive, currentProgram]);

  const onClickContainer = () => {
    if (!editMode) {
      onEnterEditMode();
    }
  };

  return (
    <div
      role="button"
      aria-expanded={editMode}
      onClick={onClickContainer}
      className={styles["lexical-filter-selector"]}
    >
      {editMode && (
        <ToggleButton
          value="check"
          fontSize="small"
          selected={rawMode}
          onClick={(e) => {
            setRawMode(!rawMode);
          }}
        >
          Raw
        </ToggleButton>
      )}
      <div className={styles["non-raw-content"]}>{markupTree}</div>
      {editMode && (
        <Button variant="text" onClick={onLeaveEditMode}>
          <KeyboardArrowUpSharp />
        </Button>
      )}
    </div>
  );
};
