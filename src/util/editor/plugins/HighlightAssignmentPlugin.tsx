import { useQuery } from "@apollo/client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $nodesOfType,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  LexicalCommand,
} from "lexical";
import React, { useEffect, useMemo } from "react";
import { gql } from "util/apollo";
import {
  fixHues,
  HighlightAssignmentNode,
  toggleHighlightAssignment,
  ToggleHighlightAssignmentPayload,
} from "./HighlightAssignmentNode";

interface HighlightAssignmentPluginProps {
  entryKey: string;
}

const HighlightAssignmentPluginQuery = gql(`
  query HighlightAssignmentPlugin($entryKey: ID!) {
    entry (entryKey: $entryKey) {
      highlights {
        id
        entry {
          entryKey
          date
        }
        hue
      }
    }
  }
`);

export const TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND: LexicalCommand<ToggleHighlightAssignmentPayload | null> =
  createCommand("toggle-highlight-assignment");

export const HighlightAssignmentPlugin: React.FunctionComponent<
  HighlightAssignmentPluginProps
> = ({ entryKey }) => {
  const [editor] = useLexicalComposerContext();

  const { data } = useQuery(HighlightAssignmentPluginQuery, {
    variables: {
      entryKey,
    },
  });

  const highlightHueMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const highlight of data?.entry?.highlights ?? []) {
      map[highlight.id] = highlight.hue;
    }
    return map;
  }, [data?.entry?.highlights]);

  useEffect(() => {
    editor.update(() => {
      $nodesOfType(HighlightAssignmentNode).forEach((node) => {
        fixHues(node.getKey(), highlightHueMap);
      });
    });
  }, [editor, highlightHueMap]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND,
        (payload) => {
          toggleHighlightAssignment(payload);
          return true;
        },
        COMMAND_PRIORITY_NORMAL
      ),
      editor.registerUpdateListener(({ dirtyElements }) => {
        for (const [nodeKey, intentionallyMarked] of dirtyElements) {
          editor.update(() => {
            fixHues(nodeKey, highlightHueMap);
          });
        }
      })
    );
  }, [editor, highlightHueMap]);

  return null;
};
