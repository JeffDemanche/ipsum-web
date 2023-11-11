import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  LexicalCommand,
} from "lexical";
import React, { useEffect } from "react";
import {
  HighlightAssignmentNodeAttributes,
  toggleHighlightAssignment,
} from "./HighlightAssignmentNode";

interface HighlightAssignmentPluginProps {
  entryKey: string;
}

export const TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND: LexicalCommand<HighlightAssignmentNodeAttributes | null> =
  createCommand("toggle-highlight-assignment");

export const HighlightAssignmentPlugin: React.FunctionComponent<
  HighlightAssignmentPluginProps
> = ({ entryKey }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND,
        (payload) => {
          toggleHighlightAssignment(payload);
          return true;
        },
        COMMAND_PRIORITY_NORMAL
      )
    );
  }, [editor]);

  return null;
};
