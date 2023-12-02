import { useQuery } from "@apollo/client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $isElementNode,
  $nodesOfType,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  LexicalCommand,
} from "lexical";
import React, { useEffect, useMemo } from "react";
import { deleteHighlight, gql } from "util/apollo";
import { usePrevious } from "util/hooks";
import {
  $isHighlightAssignmentNode,
  fixHues,
  HighlightAssignmentNode,
  removeHighlightAssignmentFromEditor,
  applyHighlightAssignment,
  ToggleHighlightAssignmentPayload,
  isIdenticalHighlight,
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

export const REMOVE_HIGHLIGHT_ASSIGNMENT_COMMAND: LexicalCommand<ToggleHighlightAssignmentPayload | null> =
  createCommand("remove-highlight-assignment");

export const HighlightAssignmentPlugin: React.FunctionComponent<
  HighlightAssignmentPluginProps
> = ({ entryKey }) => {
  const [editor] = useLexicalComposerContext();

  const { data } = useQuery(HighlightAssignmentPluginQuery, {
    variables: {
      entryKey,
    },
  });

  const highlightIds = useMemo(() => {
    return data?.entry?.highlights.map((h) => h.id) ?? [];
  }, [data?.entry?.highlights]);

  const prevHighlightIds = usePrevious(highlightIds);

  // Handles listening for deletion of highlights, which should remove all
  // traces of the deleted highlight from the editor.
  useEffect(() => {
    const removedHighlights = prevHighlightIds?.filter(
      (highlightId) => !highlightIds.includes(highlightId)
    );

    editor.update(() => {
      removedHighlights?.forEach((highlightId) => {
        editor.dispatchCommand(REMOVE_HIGHLIGHT_ASSIGNMENT_COMMAND, {
          highlightId,
        });
      });
    });
  }, [editor, highlightIds, prevHighlightIds]);

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
  }, [editor, highlightHueMap, data]);

  useEffect(() => {
    return editor.registerCommand(
      REMOVE_HIGHLIGHT_ASSIGNMENT_COMMAND,
      (payload) => {
        removeHighlightAssignmentFromEditor(payload.highlightId);
        return true;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND,
        (payload) => {
          applyHighlightAssignment(payload);
          return true;
        },
        COMMAND_PRIORITY_NORMAL
      ),
      // This update listener listens for node changes and updates the hue
      // values on the DOM if necessary.
      editor.registerUpdateListener(({ dirtyElements }) => {
        for (const [nodeKey, intentionallyMarked] of dirtyElements) {
          editor.update(() => {
            fixHues(nodeKey, highlightHueMap);
          });
        }
      })
    );
  }, [editor, highlightHueMap]);

  useEffect(() => {
    // Deletes the highlight through API if all highlight nodes have been
    // deleted.
    return editor.registerMutationListener(
      HighlightAssignmentNode,
      (mutations, { prevEditorState }) => {
        for (const [nodeKey, mutation] of mutations) {
          editor.update(() => {
            if (mutation === "destroyed") {
              const node = prevEditorState._nodeMap.get(nodeKey);
              if ($isHighlightAssignmentNode(node)) {
                const highlightId = node.__attributes.highlightId;

                const allHighlightNodes = $nodesOfType(HighlightAssignmentNode);
                const otherNodesWithHighlight = allHighlightNodes.filter(
                  (otherNode) => {
                    return (
                      otherNode.getKey() !== nodeKey &&
                      otherNode.__attributes.highlightId === highlightId
                    );
                  }
                );

                if (otherNodesWithHighlight.length === 0) {
                  deleteHighlight(highlightId);
                }
              }
            }
          });
        }
      }
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerNodeTransform(HighlightAssignmentNode, (node) => {
      // Merge two sibling highlight nodes if they are identical.
      const nextSibling = node.getNextSibling();
      if (
        nextSibling &&
        $isElementNode(nextSibling) &&
        isIdenticalHighlight(node, nextSibling)
      ) {
        node.append(...nextSibling.getChildren());
        nextSibling.remove();
      }
    });
  }, [editor]);

  return null;
};
