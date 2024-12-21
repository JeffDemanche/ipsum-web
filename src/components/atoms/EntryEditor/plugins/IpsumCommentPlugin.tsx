import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { useEffect } from "react";

import { $isIpsumCommentNode } from "./IpsumCommentNode";

interface IpsumCommentPluginProps {
  editable?: boolean;
}

export const IpsumCommentPlugin: React.FunctionComponent<
  IpsumCommentPluginProps
> = ({ editable }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Pretty hacky way of deleting the CommentNode when it's empty.
    return editor.registerUpdateListener(({ dirtyElements }) => {
      for (const [nodeKey] of dirtyElements) {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isIpsumCommentNode(node) && node.isEmpty()) {
            node.remove();
          }
        });
      }
    });
  }, [editor]);

  return null;
};
