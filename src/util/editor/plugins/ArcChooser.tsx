import { useQuery } from "@apollo/client";
import { Autocomplete, TextField } from "@mui/material";
import {
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  RangeSelection,
} from "lexical";
import React, { useCallback, useMemo, useState } from "react";
import { createArc, createHighlight, createRelation, gql } from "util/apollo";
import { TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND } from "./HighlightAssignmentPlugin";
import styles from "./ToolbarPlugin.less";

const ArcChooserQuery = gql(`
  query ArcChooser {
    arcs {
      id
      color
      name
    }
  }
`);

interface ArcOption {
  label: string;
  name: string;
  id: string;
  color: number;
}

interface ArcChooserProps {
  entryKey: string;
  editor: LexicalEditor;
}

export const ArcChooser: React.FunctionComponent<ArcChooserProps> = ({
  entryKey,
  editor,
}) => {
  const { data } = useQuery(ArcChooserQuery);

  const options = useMemo(
    () =>
      data?.arcs?.map((arc) => ({
        label: arc.name,
        name: arc.name,
        id: arc.id,
        color: arc.color,
      })),
    [data.arcs]
  );

  const filter = useCallback((options: ArcOption[], params: any) => {
    return options;
  }, []);

  // Grabs the text selection when the user clicks on the input and keeps in
  // until the user clicks away.
  const [persistedSelection, setPersistedSelection] =
    useState<RangeSelection>(undefined);

  const onClick = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setPersistedSelection(selection);
      }
    });
  }, [editor]);

  const onBlur = useCallback(() => {
    setPersistedSelection(undefined);
  }, []);

  const onChange = useCallback(
    (value: ArcOption) => {
      if (persistedSelection.isCollapsed()) {
        return;
      }

      let arcId = value.id;
      let arcHue = value.color;
      if (arcId === "new") {
        const arc = createArc({ name: value.name });
        arcId = arc.id;
        arcHue = arc.color;
      }
      const highlight = createHighlight({ entry: entryKey });
      createRelation({
        subject: highlight.id,
        subjectType: "Highlight",
        predicate: "relates to",
        object: arcId,
        objectType: "Arc",
      });
      editor.update(() => {
        editor.getEditorState()._selection = persistedSelection;

        editor.dispatchCommand(TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND, {
          highlightId: highlight.id,
          hue: arcHue,
        });
      });
    },
    [editor, entryKey, persistedSelection]
  );

  return (
    <Autocomplete
      id="highlight-assign-select"
      options={options}
      freeSolo
      getOptionLabel={(option: ArcOption) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      onChange={(_, value) => onChange(value as ArcOption)}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        if (params.inputValue !== "") {
          filtered.push({
            label: `Add "${params.inputValue}"`,
            name: params.inputValue,
            id: "new",
            color: 0,
          });
        }

        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Add highlight"
          InputProps={{
            ...params.InputProps,
            onClick,
            onBlur,
            className: styles["highlight-assign-select-input"],
          }}
        />
      )}
      className={styles["highlight-assign-select"]}
    ></Autocomplete>
  );
};
