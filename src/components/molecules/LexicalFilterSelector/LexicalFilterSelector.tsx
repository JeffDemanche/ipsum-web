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
  onFilterProgramChange: (filterProgram: IpsumFilteringProgram) => void;
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
    setCurrentProgram((program) => program.setProgram(programText));
  }, [programText]);

  const createNodeMarkupRecursive = useCallback(
    (node: EndowedNode): JSX.Element => {
      if (!node.component) return null;

      return createElement<NodeComponentProps>(node.component as FC, {
        editMode,
        endowedNode: node,
        onRemoveChild: (node) => {},
        onAddChild: () => {},
        onDeleteSelf: () => {},

        childComponents: node.children
          .map((child) => createNodeMarkupRecursive(child))
          .filter(Boolean),
      });
    },
    [editMode]
  );

  const markupTree = useMemo(() => {
    const endowedAST = currentProgram.getEndowedAST();

    return createNodeMarkupRecursive(endowedAST);
  }, [createNodeMarkupRecursive, currentProgram]);

  console.log(currentProgram.getEndowedAST());

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
