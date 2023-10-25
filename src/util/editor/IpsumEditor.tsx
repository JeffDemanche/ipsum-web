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
import { DebouncedSavePlugin } from "./plugins/DebouncedSavePlugin";
import { EntryType } from "util/apollo";

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
  metadata: IpsumEditorMetadata;
}

export const IpsumEditor: React.FunctionComponent<IpsumEditorProps> = ({
  entryKey,
  editable = true,
  metadata,
}) => {
  const onError = useCallback((error: Error, editor: LexicalEditor) => {
    console.error(error, editor);
  }, []);

  return (
    <LexicalComposer initialConfig={{ namespace: entryKey, onError, editable }}>
      <div className={styles["editor-container"]}>
        <ToolbarPlugin />
        <div className={styles["editor-inner"]}>
          <RichTextPlugin
            contentEditable={<ContentEditable style={{ outline: "none" }} />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={
              <div className={styles["editor-placeholder"]}>
                {placeholderForDate(IpsumDateTime.today())}
              </div>
            }
          />
          <DebouncedSavePlugin entryKey={entryKey} metadata={metadata} />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
