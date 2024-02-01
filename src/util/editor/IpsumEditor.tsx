import React, { useCallback } from "react";
import styles from "./IpsumEditor.less";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalEditor } from "lexical";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ToolbarPlugin } from "./plugins";
import { placeholderForDate } from "util/placeholders";
import { IpsumDateTime } from "util/dates";
import { LoadSavePlugin } from "./plugins/LoadSavePlugin";
import { EntryType } from "util/apollo";
import { HighlightAssignmentNode } from "./plugins/HighlightAssignmentNode";
import { HighlightAssignmentPlugin } from "./plugins/HighlightAssignmentPlugin";
import { editorTheme } from "./editor-theme";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

import { highlight } from "./plugins/HighlightAssignmentPlugin.less";

export const highlightSpanClassname = highlight;

interface MetadataJournal {
  entryType: EntryType.Journal;
}

interface MetadataArc {
  entryType: EntryType.Arc;
  arcId: string;
  arcName: string;
}

export type IpsumEditorMetadata = MetadataJournal | MetadataArc;

interface IpsumEditorProps {
  entryKey: string;
  editable?: boolean;
  allowHighlighting?: boolean;
  metadata: IpsumEditorMetadata;
}

export const IpsumEditor: React.FunctionComponent<IpsumEditorProps> = ({
  entryKey,
  editable = true,
  allowHighlighting = true,
  metadata,
}) => {
  const onError = useCallback((error: Error, editor: LexicalEditor) => {
    console.error(error, editor);
  }, []);

  return (
    <LexicalComposer
      initialConfig={{
        theme: editorTheme,
        namespace: entryKey,
        onError,
        editable,
        nodes: [
          HeadingNode,
          HeadingNode,
          ListNode,
          ListItemNode,
          QuoteNode,
          LinkNode,
          HighlightAssignmentNode,
        ],
      }}
    >
      <div className={styles["editor-container"]}>
        <ToolbarPlugin
          entryKey={entryKey}
          editable={editable}
          allowHighlighting={allowHighlighting}
        />
        <div className={styles["editor-inner"]}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                data-testid={`editor-${entryKey}`}
                autoCorrect="off"
                style={{ outline: "none" }}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={
              <div className={styles["editor-placeholder"]}>
                {placeholderForDate(IpsumDateTime.today())}
              </div>
            }
          />
          <LoadSavePlugin entryKey={entryKey} metadata={metadata} />
          <HighlightAssignmentPlugin editable={editable} entryKey={entryKey} />
          <ListPlugin />
          <LinkPlugin />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
