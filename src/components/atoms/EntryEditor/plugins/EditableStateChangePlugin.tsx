import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useEffect } from "react";

interface EditableStateChangePluginProps {
  editable: boolean;
}

export const EditableStateChangePlugin: React.FunctionComponent<
  EditableStateChangePluginProps
> = ({ editable }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      editor.setEditable(editable);
    });
  }, [editable, editor]);

  return null;
};