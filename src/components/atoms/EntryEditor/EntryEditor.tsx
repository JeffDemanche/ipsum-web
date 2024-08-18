import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import cx from "classnames";
import { editorTheme } from "components/styles/editor";
import { LexicalEditor } from "lexical";
import React, { CSSProperties, useCallback, useState } from "react";
import { IpsumDateTime } from "util/dates";
import { placeholderForDate } from "util/placeholders";

import styles from "./EntryEditor.less";
import { FormattingPlugin } from "./plugins/FormattingPlugin";
import { HighlightAssignmentNode } from "./plugins/HighlightAssignmentNode";
import { HighlightAssignmentPlugin } from "./plugins/HighlightAssignmentPlugin";
import { LoadSavePlugin } from "./plugins/LoadSavePlugin";

interface EntryEditorProps {
  defaultEntryKey?: string;
  editable?: boolean;
  allowHighlighting?: boolean;
  initialHtmlString?: string;
  highlightsMap?: Record<
    string,
    {
      id: string;
      hue: number;
    }
  >;
  maxLines?: number;
  createEntry?: (htmlString: string) => string;
  updateEntry?: ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => boolean;
  deleteEntry?: (entryKey: string) => void;
  createHighlight?: () => string;
  className?: string;
}

export const EntryEditor: React.FunctionComponent<EntryEditorProps> = ({
  defaultEntryKey,
  editable = true,
  allowHighlighting = true,
  initialHtmlString,
  highlightsMap,
  maxLines,
  createEntry,
  updateEntry,
  deleteEntry,
  createHighlight,
  className,
}) => {
  const onError = useCallback((error: Error, editor: LexicalEditor) => {
    console.error(error, editor);
  }, []);

  const [entryKey, setEntryKey] = useState(defaultEntryKey);

  const lineClampStyle: CSSProperties = maxLines
    ? { WebkitLineClamp: maxLines, lineClamp: maxLines }
    : {};

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
      <div
        style={lineClampStyle}
        className={cx(
          className,
          styles["editor-container"],
          maxLines && styles["truncate"]
        )}
      >
        <FormattingPlugin createHighlight={createHighlight} />
        <div className={styles["editor-inner"]}>
          <HighlightAssignmentPlugin
            editable={editable}
            highlightsMap={highlightsMap}
          />
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
            initialHtmlString={initialHtmlString}
            setEntryKey={setEntryKey}
            createEntry={createEntry}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
          />
          <ListPlugin />
          <LinkPlugin />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
