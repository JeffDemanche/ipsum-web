import { ToggleButton } from "components/atoms/ToggleButton";
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

export interface LexicalFilterSelectorConnectionProps {
  arcByIdOrName: (idOrName: string) => {
    id: string;
    name: string;
    color: number;
  };
}

type LexicalFilterSelectorProps = {
  editMode: boolean;

  programText: string;
  onFilterProgramChange: (
    programText: string,
    filterProgram: IpsumFilteringProgram
  ) => void;
} & LexicalFilterSelectorConnectionProps;

export const LexicalFilterSelector: React.FunctionComponent<
  LexicalFilterSelectorProps
> = ({ editMode, programText, onFilterProgramChange }) => {
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
    [currentProgram, editMode, onFilterProgramChange]
  );

  const markupTree = useMemo(() => {
    const endowedAST = currentProgram.getEndowedAST();

    return createNodeMarkupRecursive(endowedAST);
  }, [createNodeMarkupRecursive, currentProgram]);

  return (
    <div className={styles["lexical-filter-selector"]}>
      <ToggleButton
        value="check"
        onClick={(e) => {
          setRawMode(!rawMode);
        }}
      >
        Raw
      </ToggleButton>
      <div className={styles["non-raw-content"]}>{markupTree}</div>
    </div>
  );
};
