import { Button } from "components/atoms/Button";
import { TextField } from "components/atoms/TextField";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IpsumFilteringProgramV1 } from "util/filtering";

import styles from "./LexicalFilterSelector.less";

interface RawModeEditorProps {
  program: IpsumFilteringProgramV1;
  setProgram: (program: IpsumFilteringProgramV1) => void;
}

export const RawModeEditor: React.FunctionComponent<RawModeEditorProps> = ({
  program,
  setProgram,
}) => {
  const [rawProgramText, setRawProgramText] = useState(program.programString);

  useEffect(() => {
    setRawProgramText(program.programString);
  }, [program]);

  const tempProgram = useMemo(() => {
    const prog = new IpsumFilteringProgramV1();
    prog.setProgram(rawProgramText);
    return prog;
  }, [rawProgramText]);

  const onTextFieldKeyDown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRawProgramText(event.currentTarget.value);
  };

  const onSave = () => {
    setProgram(tempProgram);
  };

  return (
    <>
      <TextField
        style={{ width: "100%" }}
        value={rawProgramText}
        onChange={onTextFieldKeyDown}
      ></TextField>
      <Button
        disabled={tempProgram?.errors && tempProgram?.errors.length > 0}
        onClick={onSave}
      >
        Save
      </Button>
    </>
  );
};
