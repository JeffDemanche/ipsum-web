import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";
import { mergeRegister } from "@lexical/utils";
import { DiptychContext } from "components/DiptychContext";
import { HoveredHighlightsContext } from "components/HoveredHighlightsContext";
import {
  $isElementNode,
  $nodesOfType,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from "lexical";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { deleteHighlight } from "util/apollo";
import { usePrevious } from "util/hooks";

import {
  $isHighlightAssignmentNode,
  applyHighlightAssignment,
  fixHues,
  HighlightAssignmentNode,
  isIdenticalHighlight,
  removeHighlightAssignmentFromEditor,
  ToggleHighlightAssignmentPayload,
} from "./HighlightAssignmentNode";

interface HighlightAssignmentPluginProps {
  editable?: boolean;
  onHighlightClick?: (highlightId: string) => void;
  highlightsMap?: Record<string, { id: string; hue: number }>;
}

export const TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND: LexicalCommand<ToggleHighlightAssignmentPayload | null> =
  createCommand("toggle-highlight-assignment");

export const REMOVE_HIGHLIGHT_ASSIGNMENT_COMMAND: LexicalCommand<ToggleHighlightAssignmentPayload | null> =
  createCommand("remove-highlight-assignment");

export const HIGHLIGHT_CLICK_COMMAND: LexicalCommand<{
  highlightId: string;
}> = createCommand("highlight-click");

export const DARKEN_HIGHLIGHT_COMMAND: LexicalCommand<{
  highlightIds: string[];
}> = createCommand("highlight-darken");

export const HighlightAssignmentPlugin: React.FunctionComponent<
  HighlightAssignmentPluginProps
> = ({ editable, onHighlightClick, highlightsMap }) => {
  const [editor] = useLexicalComposerContext();

  const highlightIds = Object.keys(highlightsMap ?? {});

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
    for (const highlight of Object.values(highlightsMap ?? {})) {
      map[highlight.id] = highlight.hue;
    }
    return map;
  }, [highlightsMap]);

  useEffect(() => {
    editor.update(() => {
      $nodesOfType(HighlightAssignmentNode).forEach((node) => {
        fixHues(node.getKey(), highlightHueMap);
      });
    });
  }, [editor, highlightHueMap]);

  useEffect(() => {
    return editor.registerCommand(
      HIGHLIGHT_CLICK_COMMAND,
      (payload) => {
        onHighlightClick?.(payload.highlightId);
        return true;
      },
      COMMAND_PRIORITY_NORMAL
    );
  });

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

  const { hoveredHighlightIds, setHoveredHighlightIds } = useContext(
    HoveredHighlightsContext
  );

  const { selectedHighlightId } = useContext(DiptychContext);

  const hoveredOrSelectedHighlightIds = useMemo(() => {
    const ids = new Set(hoveredHighlightIds ?? []);
    if (selectedHighlightId) {
      ids.add(selectedHighlightId);
    }
    return Array.from(ids);
  }, [hoveredHighlightIds, selectedHighlightId]);

  // Listen to changes in hovered highlight IDs and update the correct nodes to
  // display as hovered.
  useEffect(() => {
    return editor.registerCommand(
      DARKEN_HIGHLIGHT_COMMAND,
      (payload) => {
        // TODO this is a temp workaround for editable editors causing scroll
        // when the darkening mechanic is enabled on them.
        if (editable) {
          return;
        }

        $nodesOfType(HighlightAssignmentNode)
          .filter((node) => {
            return !payload.highlightIds.includes(
              node.__attributes.highlightId
            );
          })
          .forEach((node) => {
            node.setDarkened(false);
          });

        $nodesOfType(HighlightAssignmentNode)
          .filter((node) => {
            return payload.highlightIds.includes(node.__attributes.highlightId);
          })
          .forEach((node) => {
            node.setDarkened(true);
          });

        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  });

  useEffect(() => {
    return editor.update(() => {
      editor.dispatchCommand(DARKEN_HIGHLIGHT_COMMAND, {
        highlightIds: hoveredOrSelectedHighlightIds,
      });
    });
  }, [editor, hoveredOrSelectedHighlightIds]);

  const onHighlightMouseEnter = useCallback(
    (event: Event, editor: LexicalEditor, nodeKey: string) => {
      const highlightId = editor
        .getElementByKey(nodeKey)
        .getAttribute("data-highlight-id");
      setHoveredHighlightIds([highlightId]);
    },
    [setHoveredHighlightIds]
  );

  const onHighlightMouseLeave = useCallback(() => {
    setHoveredHighlightIds(undefined);
  }, [setHoveredHighlightIds]);

  return (
    <>
      <NodeEventPlugin
        eventType="mouseenter"
        nodeType={HighlightAssignmentNode}
        eventListener={onHighlightMouseEnter}
      />
      <NodeEventPlugin
        eventType="mouseleave"
        nodeType={HighlightAssignmentNode}
        eventListener={onHighlightMouseLeave}
      />
    </>
  );
};
