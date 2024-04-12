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
import { LexicalEditor } from "lexical";
import React, { useCallback, useState } from "react";
import { IpsumDateTime } from "util/dates";
import { placeholderForDate } from "util/placeholders";

import { editorTheme } from "./editor-theme";
import styles from "./IpsumEditor.less";
import { FormattingPlugin } from "./plugins/FormattingPlugin";
import { HighlightAssignmentNode } from "./plugins/HighlightAssignmentNode";
import { highlight } from "./plugins/HighlightAssignmentPlugin.less";
import { LoadSavePlugin } from "./plugins/LoadSavePlugin";

export const highlightSpanClassname = highlight;

interface IpsumEditorProps {
  defaultEntryKey?: string;
  editable?: boolean;
  allowHighlighting?: boolean;
  initialHtmlString?: string;
  createEntry?: (htmlString: string) => string;
  updateEntry?: ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => boolean;
  deleteEntry?: (entryKey: string) => void;
  className?: string;
}

export const IpsumEditor: React.FunctionComponent<IpsumEditorProps> = ({
  defaultEntryKey,
  editable = true,
  allowHighlighting = true,
  initialHtmlString,
  createEntry,
  updateEntry,
  deleteEntry,
  className,
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
        {/* <ToolbarPlugin
          entryKey={entryKey}
          editable={!!entryKey && editable}
          allowHighlighting={allowHighlighting}
        /> */}
        <FormattingPlugin />
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
            initialHtmlString={initialHtmlString}
            setEntryKey={setEntryKey}
            createEntry={createEntry}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
          />
          {/* {entryKey && (
            <HighlightAssignmentPlugin
              editable={editable}
              entryKey={entryKey}
            />
          )} */}
          <ListPlugin />
          <LinkPlugin />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
