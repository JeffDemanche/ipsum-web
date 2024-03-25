import React, { useCallback, useState } from "react";
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
import cx from "classnames";
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

interface MetadataComment {
  entryType: EntryType.Comment;
  commentId: string;
}

export type IpsumEditorMetadata =
  | MetadataJournal
  | MetadataArc
  | MetadataComment;

interface IpsumEditorProps {
  defaultEntryKey?: string;
  editable?: boolean;
  allowHighlighting?: boolean;
  createEntry: (htmlString: string) => string;
  updateEntry: ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => boolean;
  deleteEntry: (entryKey: string) => void;
  className?: string;
  metadata: IpsumEditorMetadata;
}

export const IpsumEditor: React.FunctionComponent<IpsumEditorProps> = ({
  defaultEntryKey,
  editable = true,
  allowHighlighting = true,
  createEntry,
  updateEntry,
  deleteEntry,
  className,
  metadata,
}) => {
  const onError = useCallback((error: Error, editor: LexicalEditor) => {
    console.error(error, editor);
  }, []);

  const [entryKey, setEntryKey] = useState(defaultEntryKey);

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
      <div className={cx(className, styles["editor-container"])}>
        <ToolbarPlugin
          entryKey={entryKey}
          editable={!!entryKey && editable}
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
          <LoadSavePlugin
            entryKey={entryKey}
            setEntryKey={setEntryKey}
            createEntry={createEntry}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
            metadata={metadata}
          />
          {entryKey && (
            <HighlightAssignmentPlugin
              editable={editable}
              entryKey={entryKey}
            />
          )}
          <ListPlugin />
          <LinkPlugin />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
